import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getLatestResume } from "@/features/resume/services/resumeService";
import { getInterviewHistory } from "@/features/interview/services/interviewService";
import { getJobAnalyses } from "@/features/job/services/jobService";
import { fetchChats } from "@/features/chat/services/chatService";
import { getMyProfile } from "@/features/profile/services/profileService";
import {
  Briefcase, MessageSquare, Mic, ArrowRight,
  FileText, Activity, Target, BookOpen, Sparkles, TrendingUp, Calendar, Clock, BarChart3, CheckCircle2
} from "lucide-react";
import useAuthStore from "@/features/auth/store/authStore";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardPage() {
  const { user } = useAuthStore();
  const [resumeData, setResumeData] = useState(null);
  const [interviewStats, setInterviewStats] = useState({ count: 0, avgScore: 0, lastDate: null });
  const [jobStats, setJobStats] = useState({ count: 0, lastDate: null });
  const [chatCount, setChatCount] = useState(0);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumeRes, interviewRes, jobRes, chatRes, profileRes] = await Promise.all([
          getLatestResume().catch(() => null),
          getInterviewHistory().catch(() => null),
          getJobAnalyses().catch(() => null),
          fetchChats().catch(() => null),
          getMyProfile().catch(() => null)
        ]);

        if (resumeRes?.success && resumeRes.resume) {
          setResumeData(resumeRes.resume);
        }

        if (interviewRes?.success && interviewRes.history) {
          const history = interviewRes.history;
          const completed = history.filter(s => s.score?.total);
          const avg = completed.length > 0
            ? Math.round(completed.reduce((sum, s) => sum + s.score.total, 0) / completed.length)
            : 0;
          const lastDate = history.length > 0 ? new Date(history[0].createdAt) : null;
          setInterviewStats({ count: history.length, avgScore: avg, lastDate });
        }

        if (jobRes?.success && jobRes.history) {
          const history = jobRes.history;
          const lastDate = history.length > 0 ? new Date(history[0].createdAt) : null;
          setJobStats({ count: history.length, lastDate });
        }

        if (chatRes?.success && chatRes.chats) {
          setChatCount(chatRes.chats.length);
        }

        if (profileRes?.success && profileRes.profile) {
          const p = profileRes.profile;
          let completedFields = 0;
          const totalFields = 4; // headline, bio, targetRole, socialLinks
          if (p.headline) completedFields++;
          if (p.bio) completedFields++;
          if (p.targetRole) completedFields++;
          if (p.socialLinks?.github || p.socialLinks?.linkedin) completedFields++;
          setProfileCompletion(Math.round((completedFields / totalFields) * 100));
        }

      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const atsScore = resumeData?.atsScore || 0;
  const skillsCount = resumeData?.skills?.length || 0;
  
  // Circular Progress Logic
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (atsScore / 100) * circumference;

  const statCards = [
    { label: "ATS Score", value: atsScore ? `${atsScore}%` : "N/A", icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Skills Extracted", value: skillsCount, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Mock Interviews", value: interviewStats.count, icon: Mic, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Avg Interview Score", value: interviewStats.avgScore ? `${interviewStats.avgScore}/100` : "N/A", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-12">

      {/* Hero Section */}
      <div className="border-b bg-muted/20">
        <div className="max-w-6xl mx-auto p-6 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Welcome back, {user?.name?.split(" ")[0]}! 👋
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Here's your career readiness overview. Keep improving!
              </p>
            </div>

            {/* Circular ATS Score */}
            <div className="flex items-center gap-5 bg-card border rounded-2xl p-5 shadow-sm min-w-[280px]">
              {loading ? (
                <div className="flex items-center gap-5 w-full">
                  <Skeleton className="w-24 h-24 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative flex items-center justify-center">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle cx="48" cy="48" r={radius} className="stroke-secondary fill-none" strokeWidth="6" />
                      <circle
                        cx="48" cy="48" r={radius}
                        className={`${atsScore >= 70 ? 'stroke-emerald-500' : atsScore >= 40 ? 'stroke-amber-500' : 'stroke-destructive'} fill-none transition-all duration-1000 ease-out`}
                        strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">{atsScore}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Profile Strength</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {atsScore === 0 ? "Upload your resume" : atsScore >= 70 ? "Ready to apply!" : "Needs improvement"}
                    </p>
                    {atsScore === 0 && (
                      <Link to="/job/analyze" className="text-primary text-xs font-medium hover:underline mt-1 inline-block">
                        Upload Now →
                      </Link>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">

        {/* Top Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="border rounded-xl p-4 bg-card shadow-sm flex items-center gap-3">
                <div className={`p-2.5 rounded-lg shrink-0 ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                  {loading ? (
                    <Skeleton className="h-6 w-12 mt-1" />
                  ) : (
                    <p className="text-xl font-bold mt-0.5">{stat.value}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Analytics Section */}
        <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" /> Analytics Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Recent Activity */}
                <div className="md:col-span-2 border rounded-2xl p-6 bg-card shadow-sm">
                    <h3 className="font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {/* Resume */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-blue-500" />
                                <div>
                                    <p className="text-sm font-medium">Resume Uploaded</p>
                                    <p className="text-xs text-muted-foreground">Latest version parsed by AI</p>
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {loading ? <Skeleton className="h-4 w-20" /> : resumeData?.createdAt ? new Date(resumeData.createdAt).toLocaleDateString() : 'Never'}
                            </div>
                        </div>

                        {/* Job Match */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                                <Briefcase className="w-5 h-5 text-indigo-500" />
                                <div>
                                    <p className="text-sm font-medium">JD Analyzed</p>
                                    <p className="text-xs text-muted-foreground">Total JDs matched: {jobStats.count}</p>
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {loading ? <Skeleton className="h-4 w-20" /> : jobStats.lastDate ? jobStats.lastDate.toLocaleDateString() : 'Never'}
                            </div>
                        </div>

                        {/* Interview */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                                <Mic className="w-5 h-5 text-purple-500" />
                                <div>
                                    <p className="text-sm font-medium">Mock Interview Completed</p>
                                    <p className="text-xs text-muted-foreground">Total interviews: {interviewStats.count}</p>
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {loading ? <Skeleton className="h-4 w-20" /> : interviewStats.lastDate ? interviewStats.lastDate.toLocaleDateString() : 'Never'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile & Chat */}
                <div className="space-y-6">
                    {/* Profile Completion */}
                    <div className="border rounded-2xl p-6 bg-card shadow-sm">
                        <h3 className="font-semibold mb-2">Profile Completion</h3>
                        {loading ? (
                            <Skeleton className="h-2 w-full mt-4 mb-2" />
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-muted-foreground">Complete your profile to stand out</span>
                                    <span className="text-sm font-bold text-primary">{profileCompletion}%</span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-2.5">
                                    <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${profileCompletion}%` }}></div>
                                </div>
                                {profileCompletion < 100 && (
                                    <Link to="/profile" className="text-xs text-primary hover:underline mt-3 inline-block">
                                        Complete Profile →
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                    {/* Chat Stats */}
                    <div className="border rounded-2xl p-6 bg-card shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                            <MessageSquare className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">AI Mentor Chats</p>
                            {loading ? (
                                <Skeleton className="h-6 w-12 mt-1" />
                            ) : (
                                <h3 className="text-2xl font-bold">{chatCount}</h3>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
        
        {/* Empty States Section */}
        {!loading && interviewStats.count === 0 && (
          <div className="border border-dashed border-primary/50 bg-primary/5 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mic className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Mock Interviews Yet</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Start your first AI mock interview to practice answering technical and behavioral questions tailored to your target role.
            </p>
            <Link to="/interview/setup">
              <Button className="gap-2">
                Start Mock Interview <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <div className="p-6 border rounded-2xl shadow-sm bg-card flex flex-col justify-between hover:border-blue-500/30 transition-colors">
              <div>
                <div className="w-11 h-11 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Briefcase className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Job Match Engine</h3>
                <p className="text-muted-foreground text-sm mb-5">Analyze any job description against your resume to find missing keywords.</p>
              </div>
              <Link to="/job/analyze">
                <Button variant="outline" className="w-full justify-between group">
                  Analyze Job
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="p-6 border rounded-2xl shadow-sm bg-emerald-500/5 border-emerald-500/20 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
              <div>
                <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                  <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold mb-1 text-emerald-700 dark:text-emerald-400">AI Career Mentor</h3>
                <p className="text-emerald-600/80 dark:text-emerald-400/80 text-sm mb-5">Chat with your personalized mentor to improve skills and resume.</p>
              </div>
              <Link to="/chat">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white justify-between group">
                  Ask AI Mentor
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="p-6 border rounded-2xl shadow-sm bg-purple-500/5 border-purple-500/20 flex flex-col justify-between hover:border-purple-500/40 transition-colors">
              <div>
                <div className="w-11 h-11 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Mic className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-1 text-purple-700 dark:text-purple-400">Mock Interview</h3>
                <p className="text-purple-600/80 dark:text-purple-400/80 text-sm mb-5">Practice tailored interview questions and get scored instantly.</p>
              </div>
              <Link to="/interview/setup">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white justify-between group">
                  Start Interview
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

          </div>
        </div>

        {/* Platform Features */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Everything You Need For Your Career</h2>
            <p className="text-muted-foreground mt-2">TalentMind AI is your all-in-one career acceleration platform</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
              <FileText className="w-6 h-6 text-blue-500 mb-3" />
              <h3 className="font-semibold mb-1">Smart Resume Parsing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Upload your resume and our AI extracts skills, experience, and generates an ATS compatibility score instantly.</p>
            </div>
            <div className="p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
              <Briefcase className="w-6 h-6 text-indigo-500 mb-3" />
              <h3 className="font-semibold mb-1">JD Match Engine</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Paste any job description and get a detailed match analysis — matched skills, missing skills, and a personalized roadmap.</p>
            </div>
            <div className="p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
              <Mic className="w-6 h-6 text-purple-500 mb-3" />
              <h3 className="font-semibold mb-1">AI Mock Interviews</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Practice with AI-generated interview questions tailored to your target role, then receive a detailed score breakdown.</p>
            </div>
            <div className="p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
              <MessageSquare className="w-6 h-6 text-emerald-500 mb-3" />
              <h3 className="font-semibold mb-1">Career Mentor Chat</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Chat with an AI mentor that has full context on your resume and job matches for highly personalized career advice.</p>
            </div>
            <div className="p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
              <BookOpen className="w-6 h-6 text-amber-500 mb-3" />
              <h3 className="font-semibold mb-1">30-Day Learning Plans</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">After every mock interview, receive a curated improvement plan with topics, projects, and resources to study.</p>
            </div>
            <div className="p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
              <Sparkles className="w-6 h-6 text-rose-500 mb-3" />
              <h3 className="font-semibold mb-1">Personalized Roadmaps</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Get AI-generated career roadmaps based on your current skills and target role to bridge the gap effectively.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;