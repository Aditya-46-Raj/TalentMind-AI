import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getJobAnalysisById } from "../services/jobService";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle2, XCircle, Lightbulb, Trophy } from "lucide-react";

function AnalysisResultPage() {
    const { id } = useParams();
    const [analysisData, setAnalysisData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalysis();
    }, [id]);

    const fetchAnalysis = async () => {
        setIsLoading(true);
        try {
            const data = await getJobAnalysisById(id);
            if (data.success) {
                setAnalysisData(data.analysis);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load analysis");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto p-8 text-center space-y-4">
                <div className="p-4 text-sm font-medium text-destructive bg-destructive/10 rounded-md">
                    {error}
                </div>
                <Link to="/job/analyze">
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </Button>
                </Link>
            </div>
        );
    }

    if (!analysisData) return null;

    const {
        jobTitle,
        company,
        matchScore,
        matchedSkills,
        missingSkills,
        analysis,
        roadmap
    } = analysisData;

    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (matchScore / 100) * circumference;

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/job/analyze">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Analysis Results</h1>
                        <p className="text-muted-foreground mt-1">{jobTitle} at {company}</p>
                    </div>
                </div>
                <Link to="/job/analyze">
                    <Button variant="outline">Analyze Another Job</Button>
                </Link>
            </div>

            {/* Score Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 border rounded-2xl bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="relative flex items-center justify-center mb-4">
                        <svg className="w-32 h-32 transform -rotate-90">
                            <circle cx="64" cy="64" r={radius} className="stroke-secondary fill-none" strokeWidth="8" />
                            <circle
                                cx="64" cy="64" r={radius}
                                className={`${matchScore >= 70 ? 'stroke-emerald-500' : matchScore >= 40 ? 'stroke-amber-500' : 'stroke-destructive'} fill-none transition-all duration-1000 ease-out`}
                                strokeWidth="8"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold">{matchScore}%</span>
                            <span className="text-xs text-muted-foreground">Match Score</span>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {matchScore >= 70 ? "Strong match! Your resume is well aligned." :
                         matchScore >= 40 ? "Decent match. Some skills need improvement." :
                         "Low match. Focus on the missing skills below."}
                    </p>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Matched Skills */}
                    <div className="border rounded-2xl bg-emerald-500/5 border-emerald-500/20 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-5 h-5" />
                            <h3 className="font-semibold">Matched Skills ({matchedSkills.length})</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {matchedSkills.length > 0 ? matchedSkills.map((skill, index) => (
                                <span key={index} className="px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">
                                    {skill}
                                </span>
                            )) : (
                                <p className="text-sm text-muted-foreground">No matched skills found.</p>
                            )}
                        </div>
                    </div>

                    {/* Missing Skills */}
                    <div className="border rounded-2xl bg-destructive/5 border-destructive/20 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-destructive">
                            <XCircle className="w-5 h-5" />
                            <h3 className="font-semibold">Missing Skills ({missingSkills.length})</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {missingSkills.length > 0 ? missingSkills.map((skill, index) => (
                                <span key={index} className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm font-medium">
                                    {skill}
                                </span>
                            )) : (
                                <p className="text-sm text-muted-foreground">No missing skills. Great match!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Analysis */}
            {analysis && (
                <div className="border rounded-2xl bg-card p-6 md:p-8 shadow-sm space-y-6">
                    <h2 className="text-2xl font-bold border-b pb-3">AI Feedback</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h3 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Strengths
                            </h3>
                            <ul className="space-y-2">
                                {analysis.strengths?.map((item, i) => (
                                    <li key={i} className="text-sm text-foreground flex items-start gap-2">
                                        <span className="text-emerald-500 mt-0.5">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-destructive mb-3 flex items-center gap-2">
                                <XCircle className="w-4 h-4" /> Weaknesses
                            </h3>
                            <ul className="space-y-2">
                                {analysis.weaknesses?.map((item, i) => (
                                    <li key={i} className="text-sm text-foreground flex items-start gap-2">
                                        <span className="text-destructive mt-0.5">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4" /> Suggestions
                            </h3>
                            <ul className="space-y-2">
                                {analysis.suggestions?.map((item, i) => (
                                    <li key={i} className="text-sm text-foreground flex items-start gap-2">
                                        <span className="text-amber-500 mt-0.5">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Roadmap */}
            {roadmap && roadmap.length > 0 && (
                <div className="border rounded-2xl bg-purple-500/5 border-purple-500/20 p-6 md:p-8 shadow-sm space-y-4">
                    <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400 border-b border-purple-500/20 pb-3">
                        Your Personalized Roadmap
                    </h2>
                    <div className="space-y-4">
                        {roadmap.map((step, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                </div>
                                <div className="pt-1 text-foreground text-sm">
                                    {step}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AnalysisResultPage;
