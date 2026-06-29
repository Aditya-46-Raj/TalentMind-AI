import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getInterviewById } from "../services/interviewService";
import { Loader2, ArrowLeft, CheckCircle2, XCircle, Lightbulb, Trophy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";

function InterviewReportPage() {
    const { id } = useParams();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await getInterviewById(id);
                if (res.success) {
                    setSession(res.session);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load interview report.");
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !session) {
        return (
            <div className="max-w-2xl mx-auto p-8 text-center text-destructive">
                {error || "Report not found"}
            </div>
        );
    }

    const { score, feedback, improvementPlan } = session;

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex items-center gap-4">
                <Link to="/dashboard">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Interview Report</h1>
                    <p className="text-muted-foreground mt-1">{session.role} at {session.company}</p>
                </div>
            </div>

            {/* Score Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 border rounded-2xl bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Trophy className="w-12 h-12 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Overall Score</p>
                    <h2 className="text-5xl font-bold text-primary">{score?.total || 0}</h2>
                    <p className="text-sm text-muted-foreground mt-2">out of 100</p>
                </div>

                <div className="md:col-span-2 border rounded-2xl bg-card p-6 shadow-sm space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Score Breakdown</h3>

                    <div className="space-y-4 pt-2">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Technical Accuracy</span>
                                <span className="font-medium">{score?.technicalAccuracy || 0}/40</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${((score?.technicalAccuracy || 0) / 40) * 100}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Communication</span>
                                <span className="font-medium">{score?.communication || 0}/20</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${((score?.communication || 0) / 20) * 100}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Problem Solving</span>
                                <span className="font-medium">{score?.problemSolving || 0}/20</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${((score?.problemSolving || 0) / 20) * 100}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Project Knowledge</span>
                                <span className="font-medium">{score?.projectKnowledge || 0}/20</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${((score?.projectKnowledge || 0) / 20) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >

            {/* Feedback Section */}
            < div className="grid grid-cols-1 md:grid-cols-3 gap-6" >
                <div className="border rounded-2xl bg-emerald-500/5 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-emerald-600">
                        <CheckCircle2 className="w-5 h-5" />
                        <h3 className="font-semibold">Strengths</h3>
                    </div>
                    <ul className="space-y-2">
                        {feedback?.strengths?.map((item, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5">•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="border rounded-2xl bg-destructive/5 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-destructive">
                        <XCircle className="w-5 h-5" />
                        <h3 className="font-semibold">Weaknesses</h3>
                    </div>
                    <ul className="space-y-2">
                        {feedback?.weaknesses?.map((item, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                                <span className="text-destructive mt-0.5">•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="border rounded-2xl bg-amber-500/5 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-amber-600">
                        <Lightbulb className="w-5 h-5" />
                        <h3 className="font-semibold">Suggestions</h3>
                    </div>
                    <ul className="space-y-2">
                        {feedback?.suggestions?.map((item, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div >

            {/* Improvement Plan */}
            < div className="border rounded-2xl bg-card p-6 md:p-8 shadow-sm" >
                <h3 className="text-2xl font-bold mb-6">Your 30-Day Improvement Plan</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h4 className="font-semibold mb-3">Topics to Study</h4>
                        <ul className="space-y-2">
                            {improvementPlan?.topicsToStudy?.map((item, idx) => (
                                <li key={idx} className="text-sm bg-secondary px-3 py-2 rounded-md">{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3">Projects to Build</h4>
                        <ul className="space-y-2">
                            {improvementPlan?.projectsToBuild?.map((item, idx) => (
                                <li key={idx} className="text-sm bg-secondary px-3 py-2 rounded-md">{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                    <ReactMarkdown>
                        {improvementPlan?.thirtyDayPlan || ""}
                    </ReactMarkdown>
                </div>
            </div >

        </div >
    );
}

export default InterviewReportPage;
