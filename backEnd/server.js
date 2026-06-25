import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import formidable from "formidable";
import fs from "fs";
import { rateLimit } from "express-rate-limit";
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Enable if deploying behind a reverse proxy (Heroku, Render, AWS ALB, etc.)
app.set("trust proxy", 1);

// ----------------------------------
// Rate Limiter Configuration
// ----------------------------------

const matchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute tracking window
  max: 10, // Limit each IP address to 10 resume reviews per window
  message: {
    error: "Too many resume analysis requests. Please try again in 15 minutes.",
  },
  standardHeaders: true, // Return standard RateLimit headers
  legacyHeaders: false, // Disable older X-RateLimit headers
});

// ----------------------------------
// Gemini Client & Strict Schema Definition
// ----------------------------------

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Using GoogleGenAI JSON schema format to enforce strict structural output
const atsSchema = {
  type: "OBJECT",
  properties: {
    match_score: { type: "NUMBER" },
    summary: { type: "STRING" },
    missing_criteria: { type: "ARRAY", items: { type: "STRING" } },
    strengths: { type: "ARRAY", items: { type: "STRING" } },
    suggested_resume_improvements: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: [
    "match_score",
    "summary",
    "missing_criteria",
    "strengths",
    "suggested_resume_improvements",
  ],
};

// ----------------------------------
// Vector Similarity
// ----------------------------------

const cosineSimilarity = (vecA, vecB) => {
  if (!vecA?.length || !vecB?.length) return 0;

  const dotProduct = vecA.reduce(
    (sum, a, i) => sum + a * (vecB[i] || 0),
    0
  );

  const magnitudeA = Math.sqrt(
    vecA.reduce((sum, a) => sum + a * a, 0)
  );

  const magnitudeB = Math.sqrt(
    vecB.reduce((sum, b) => sum + b * b, 0)
  );

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
};

// ----------------------------------
// Gemini Embeddings
// ----------------------------------

const em = async (text) => {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });

  if (!response?.embeddings?.[0]?.values) {
    throw new Error("Failed to generate embeddings.");
  }

  return response.embeddings[0].values;
};

// ----------------------------------
// Gemini Analysis (Structured JSON Outputs)
// ----------------------------------

async function gpt(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: atsSchema, // Guarantees compliant JSON output natively
      temperature: 0.2,
    },
  });

  return response?.text || "";
}

// ----------------------------------
// Azure Form Recognizer
// ----------------------------------

const formRecognizerClient = new DocumentAnalysisClient(
  process.env.FORM_RECOGNIZER_ENDPOINT,
  new AzureKeyCredential(process.env.FORM_RECOGNIZER_API_KEY)
);

async function extractTextFromFile(filePath) {
  const fileBuffer = fs.readFileSync(filePath);

  const poller = await formRecognizerClient.beginAnalyzeDocument(
    "prebuilt-read",
    fileBuffer
  );

  const result = await poller.pollUntilDone();

  if (!result?.content) {
    throw new Error("Failed to extract text from resume.");
  }

  return result.content;
}

// ----------------------------------
// Utility Functions
// ----------------------------------

function cleanupFile(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Cleaned up temp file: ${filePath}`);
    }
  } catch (err) {
    console.error("Cleanup error:", err);
  }
}

// ----------------------------------
// ATS Match Endpoint (Optimized & Secure)
// ----------------------------------

app.post("/api/match", matchLimiter, async (req, res) => {
  const form = formidable({});
  let uploadedFilePath = null;

  try {
    // 1. Promisified Form Parsing (Avoids mixed callback anti-patterns)
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const rawFile = Array.isArray(files.file) ? files.file[0] : files.file;
    const rawJd = Array.isArray(fields.jobDescription) ? fields.jobDescription[0] : fields.jobDescription;

    if (!rawFile || !rawJd) {
      return res.status(400).json({
        error: "Resume file and Job Description are required.",
      });
    }

    // Capture the path as early as possible for the fallback cleanup
    uploadedFilePath = rawFile.filepath;

    // 2. File Type Validation (Basic Guardrail)
    const allowedMimeTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/msword", // .doc
      "text/plain"
    ];

    if (!allowedMimeTypes.includes(rawFile.mimetype)) {
      return res.status(400).json({
        error: "Unsupported file type. Please upload a PDF, DOCX, or TXT file.",
      });
    }

    console.log("Extracting resume text...");
    const resumeText = await extractTextFromFile(uploadedFilePath);

    console.log("Resume Characters:", resumeText.length);
    console.log("JD Characters:", rawJd.length);

    // Truncation limits for stability
    const resumeForAnalysis = resumeText.slice(0, 12000);
    const jdForAnalysis = rawJd.slice(0, 8000);

    // 3. Parallelized Async Flow (Saves ~50% processing time here)
    console.log("Generating embeddings in parallel...");
    const [resumeEmbedding, jdEmbedding] = await Promise.all([
      em(resumeForAnalysis),
      em(jdForAnalysis),
    ]);

    const similarity = cosineSimilarity(resumeEmbedding, jdEmbedding);
    const similarityScore = Math.max(
      0,
      Math.min(100, similarity * 100)
    ).toFixed(2);

    console.log("Similarity Score:", similarityScore);

    const prompt = `
You are an expert ATS and recruitment analyst.
Analyze the resume against the job description.

Resume:
${resumeForAnalysis}

Job Description:
${jdForAnalysis}

Embedding Similarity Score:
${similarityScore}
`;

    console.log("Calling Gemini...");
    const rawResponse = await gpt(prompt);

    if (!rawResponse) {
      throw new Error("Gemini returned an empty response.");
    }

    // 4. Clean JSON parsing directly from structured output
    const parsedData = JSON.parse(rawResponse);
    return res.status(200).json(parsedData);

  } catch (error) {
    console.error("Error Inside Match Handler:", error);
    return res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  } finally {
    // 5. Guaranteed Cleanup Block (Runs regardless of success, validation errors, or crashes)
    if (uploadedFilePath) {
      cleanupFile(uploadedFilePath);
    }
  }
});

// ----------------------------------
// Health Check
// ----------------------------------

app.get("/", (req, res) => {
  res.json({
    status: "running",
    service: "AI ATS Backend",
  });
});

// ----------------------------------
// Start Server
// ----------------------------------

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
})
