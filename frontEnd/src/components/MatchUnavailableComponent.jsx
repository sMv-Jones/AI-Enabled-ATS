import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Zap, ChevronLeft, Award, FileText, CheckCircle2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export function MatchResultsComponent({ data }) {
  const navigate = useNavigate()
  const matchData = {
    overallMatch: data?.match_score || 0,
    summary: data?.summary || "",
    missingSkills: data?.missing_criteria ? [...data.missing_criteria] : [],
    strongPoints: data?.strengths ? [...data.strengths] : [],
    suggestedImprovements: data?.suggested_resume_improvements ? [...data.suggested_resume_improvements] : []
  }

  return (
    <div className="min-h-screen bg-[#0b1329] text-slate-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0b1329] to-[#050914]">
      
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-blue-400 mr-2 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">ResuMatch AI</span>
          </div>
          <Link to="/" className="text-slate-400 hover:text-white flex items-center transition-colors text-sm font-medium gap-1 group">
            <ChevronLeft className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Prominent and High-Contrast Action Navigation Bar */}
        <div className="flex items-center justify-between bg-slate-900/60 border border-white/5 p-3 rounded-xl backdrop-blur-sm shadow-md">
          <Button 
            onClick={() => navigate('/')}
            variant="secondary"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg px-4 py-2 text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all"
          >
            <ChevronLeft className="h-4 w-4 stroke-[3]" />
            Back to Upload Screen
          </Button>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
            Want to swap files? Use the back button to start over.
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Section Title */}
          <div className="text-center py-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">Match Analytics</h1>
          </div>

          {/* Core Row: Circle & Text Summary */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-gradient-to-b from-slate-900/80 to-slate-950/80 border-blue-500/10 text-slate-100 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.3)] flex flex-col justify-between">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-semibold tracking-wider uppercase text-slate-400">Overall Match</CardTitle>
                <Award className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center pt-2 pb-6 flex-grow">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle className="text-white/5 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent" />
                    <motion.circle
                      className="text-blue-500 stroke-current drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                      strokeWidth="8"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      initial={{ strokeDasharray: "251.2 251.2", strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: 251.2 - (251.2 * matchData.overallMatch) / 100 }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-300">{matchData.overallMatch}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 bg-gradient-to-b from-slate-900/80 to-slate-950/80 border-cyan-500/10 text-slate-100 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.3)]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 border-b border-white/5">
                <CardTitle className="text-base font-bold text-white tracking-tight">AI Analysis Summary</CardTitle>
                <FileText className="h-4 w-4 text-cyan-400 opacity-80" />
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-slate-300 leading-relaxed font-normal text-sm whitespace-pre-wrap">{matchData.summary}</p>
              </CardContent>
            </Card>
          </div>

          {/* Badges Layout: Missing Skills vs Strengths */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gradient-to-b from-slate-900/80 to-slate-950/80 border-white/5 text-slate-100 backdrop-blur-md shadow-xl">
              <CardHeader className="pb-2.5 border-b border-white/5">
                <CardTitle className="text-white text-sm font-bold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-400" /> Missing Skills / Gaps
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {matchData.missingSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {matchData.missingSkills.map((skill, index) => (
                      <Badge key={index} variant="destructive" className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-md text-xs font-medium">{skill}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No critical text gaps identified.</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-slate-900/80 to-slate-950/80 border-white/5 text-slate-100 backdrop-blur-md shadow-xl">
              <CardHeader className="pb-2.5 border-b border-white/5">
                <CardTitle className="text-white text-sm font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Strong Points / Matches
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {matchData.strongPoints.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {matchData.strongPoints.map((skill, index) => (
                      <Badge key={index} variant="default" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md text-xs font-medium">{skill}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No clear matching indicators detected.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actionable Insights Layout */}
          <Card className="bg-gradient-to-b from-slate-900/80 to-slate-950/80 border-white/5 text-slate-100 backdrop-blur-md shadow-xl">
            <CardHeader className="pb-2.5 border-b border-white/5">
              <CardTitle className="text-white text-sm font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" /> Suggested Resume Improvements
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {matchData.suggestedImprovements.length > 0 ? (
                <ul className="space-y-3 text-slate-300 text-sm">
                  {matchData.suggestedImprovements.map((suggestion, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-2.5 bg-white/5 p-3 rounded-lg border border-white/5 leading-relaxed"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
                      <span>{suggestion}</span>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 italic text-center py-4">Your template matches target matrices well! No updates generated.</p>
              )}
            </CardContent>
          </Card>

          {/* Secondary Persistent Bottom Return Action */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="border-white/10 hover:bg-white/5 text-slate-300 hover:text-white font-medium rounded-xl py-5 px-6 flex items-center gap-2 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              Analyze Another Document
            </Button>
          </div>

        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-500 text-xs">
          <p>&copy; 2026 ResuMatch AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}