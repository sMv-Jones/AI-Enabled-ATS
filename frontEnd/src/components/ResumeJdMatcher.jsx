import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Upload, FileText, Zap, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from "../hooks/use-toast"

export function ResumeJdMatcher({ setData }) {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (!file || !jobDescription) {
      setIsLoading(false);
      toast({
        title: 'Missing information',
        description: 'Please upload a resume and provide a job description.',
        variant: "destructive"
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/match`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error processing the file');
      }

      const result = await response.json();
      setData(result);
      if (result) {
        navigate('/match', { replace: true })
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while processing your request.';
      toast({
        title: 'An error occurred while processing your request.',
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1329] text-slate-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0b1329] to-[#050914]">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-white/10 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-blue-400 mr-2 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">ResuMatch AI</span>
          </div>   
        </div>
      </motion.header>

      <main className="flex-grow p-4 sm:p-8 max-w-5xl mx-auto w-full flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full py-8"
        >
          <h1 className="text-4xl font-extrabold text-center mb-3 tracking-tight text-white drop-shadow-sm">AI Resume Matcher</h1>
          <p className="text-lg text-center mb-12 text-slate-400 max-w-xl mx-auto leading-relaxed">
            Upload your resume and enter a job description to see how well they match!
          </p>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="bg-gradient-to-b from-slate-900/80 to-slate-950/80 border-blue-500/10 text-slate-100 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:border-blue-500/20 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-white text-xl font-bold tracking-tight">Upload Resume</CardTitle>
                  <FileText className="h-5 w-5 text-blue-400 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-white/5 border-dashed rounded-xl cursor-pointer bg-slate-950/50 hover:bg-slate-900/30 hover:border-blue-500/30 transition-all group shadow-inner"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                        <div className="p-4 rounded-full bg-blue-500/5 group-hover:bg-blue-500/10 mb-4 transition-colors">
                          <Upload className="w-8 h-8 text-slate-500 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <p className="mb-2 text-sm text-slate-400">
                          <span className="font-semibold text-blue-400 group-hover:text-blue-300">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">PDF, DOCX (MAX. 5MB)</p>
                      </div>
                      <Input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.docx"
                      />
                    </label>
                  </div>
                  {file && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 text-sm text-slate-200 flex items-center bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 backdrop-blur-md shadow-sm"
                    >
                      <FileText className="mr-2 text-blue-400 shrink-0" size={18} />
                      <span className="truncate font-medium">{file.name}</span>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-b from-slate-900/80 to-slate-950/80 border-cyan-500/10 text-slate-100 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:border-cyan-500/20 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-white text-xl font-bold tracking-tight">Job Description</CardTitle>
                  <Sparkles className="h-5 w-5 text-cyan-400 opacity-80" />
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Paste the job description details here..."
                    className="w-full h-64 resize-none bg-slate-950/50 border-white/5 rounded-xl text-slate-100 p-4 placeholder:text-slate-600 focus-visible:ring-cyan-500/40 focus-visible:border-cyan-500/30 transition-all shadow-inner leading-relaxed"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={!file || !jobDescription || isLoading}
                className="w-full sm:w-auto min-w-[220px] shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-6 text-base tracking-wide rounded-xl border-none"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2.5"
                  >
                    <Zap className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <Zap className="mr-2.5 h-5 w-5" />
                )}
                {isLoading ? "Analyzing..." : "Match Resume"}
              </Button>
            </div>
          </form>
        </motion.div>
      </main>

      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-t border-white/5 bg-slate-950/20 mt-auto"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold tracking-tight text-white mb-1">ResuMatch AI</h2>
              <p className="text-sm text-slate-400">Empowering your job search with AI</p>
            </div>
            <div className="flex space-x-6">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-300 transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-white/5 pt-6 text-center md:text-left">
            <p className="text-xs text-slate-500">
              &copy; 2026 ResuMatch AI. All rights reserved.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}