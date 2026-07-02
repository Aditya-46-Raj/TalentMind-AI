import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getLatestResume } from "@/features/resume/services/resumeService";
import { Briefcase, MessageSquare, Mic, Loader2, ArrowRight } from "lucide-react";
import useAuthStore from "@/features/auth/store/authStore";

function DashboardPage() {
  const { user } = useAuthStore();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getLatestResume();
        if (res.success && res.resume) {
          setResumeData(res.resume);
        }
      } catch (err) {
        console.error("Failed to load profile stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const atsScore = resumeData?.atsScore || 0;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (atsScore / 100) * circumference;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name?.split(" ")[0]}!</h1>
          <p className="text-muted-foreground mt-1">Here is what's happening with your job search today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ATS Score Circular Graph */}
        <div className="md:col-span-1 p-6 border rounded-2xl shadow-sm bg-card flex flex-col items-center justify-center text-center">
          <h2 className="text-lg font-semibold mb-4 w-full text-left">Your Profile Strength</h2>
          
          {loading ? (
            <div className="h-[120px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="relative flex items-center justify-center mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  className="stroke-secondary fill-none"
                  strokeWidth="8"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  className={`${atsScore >= 70 ? 'stroke-emerald-500' : atsScore >= 40 ? 'stroke-amber-500' : 'stroke-destructive'} fill-none transition-all duration-1000 ease-out`}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{atsScore}%</span>
                <span className="text-xs text-muted-foreground">ATS Score</span>
              </div>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            {atsScore === 0 ? "Upload your resume to get an ATS score." : 
             atsScore >= 70 ? "Excellent profile! You are ready to apply." : 
             "Your profile needs improvement. Use AI Mentor to upgrade it."}
          </p>
        </div>

        {/* Action Cards */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="p-6 border rounded-2xl shadow-sm bg-card flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Job Match Engine</h3>
              <p className="text-muted-foreground text-sm mb-4">Analyze any job description against your resume to find missing keywords.</p>
            </div>
            <Link to="/job/analyze">
              <Button variant="outline" className="w-full justify-between group">
                Analyze Job
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="p-6 border rounded-2xl shadow-sm bg-emerald-500/5 border-emerald-500/20 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-emerald-700 dark:text-emerald-400">AI Career Mentor</h3>
              <p className="text-emerald-600/80 dark:text-emerald-400/80 text-sm mb-4">Chat with your personalized mentor to improve your skills and resume.</p>
            </div>
            <Link to="/chat">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white justify-between group">
                Ask AI Mentor
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="sm:col-span-2 p-6 border rounded-2xl shadow-sm bg-purple-500/5 border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0">
                <Mic className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-400">AI Mock Interview Simulator</h3>
                <p className="text-purple-600/80 dark:text-purple-400/80 text-sm">Practice tailored interview questions and get scored on your answers instantly.</p>
              </div>
            </div>
            <Link to="/interview/setup" className="w-full sm:w-auto shrink-0">
              <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white gap-2">
                Start Mock Interview
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DashboardPage;