import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInterviewById, submitInterview } from "../services/interviewService";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";

function InterviewSessionPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [answers, setAnswers] = useState([]); // Array of { question, answer }

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await getInterviewById(id);
                if (res.success) {
                    setSession(res.session);
                    if (res.session.score && res.session.score.total) {
                        // Already completed, redirect to report
                        navigate(`/interview/report/${id}`);
                    }
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load interview session.");
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, [id, navigate]);

    const handleNext = async () => {
        if (!currentAnswer.trim()) {
            return;
        }

        const newAnswers = [
            ...answers,
            { question: session.questions[currentQIndex], answer: currentAnswer }
        ];

        setAnswers(newAnswers);
        setCurrentAnswer("");

        if (currentQIndex < session.questions.length - 1) {
            setCurrentQIndex(currentQIndex + 1);
        } else {
            // Submit the interview
            setSubmitting(true);
            try {
                const res = await submitInterview({ sessionId: id, answers: newAnswers });
                if (res.success) {
                    import("sonner").then(({ toast }) => toast.success("Interview completed! Generating report..."));
                    navigate(`/interview/report/${id}`);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to submit interview. Please try again.");
                setSubmitting(false);
            }
        }
    };

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
                {error || "Session not found"}
            </div>
        );
    }

    const currentQuestion = session.questions[currentQIndex];
    const isLastQuestion = currentQIndex === session.questions.length - 1;

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-xl font-bold">Mock Interview</h1>
                <span className="text-sm font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                    Question {currentQIndex + 1} of {session.questions.length}
                </span>
            </div>

            {submitting ? (
                <div className="border rounded-2xl p-12 bg-card shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <h2 className="text-2xl font-bold">Evaluating your answers...</h2>
                    <p className="text-muted-foreground">The AI is analyzing your responses against the core requirements for {session.role}. This may take a few seconds.</p>
                </div>
            ) : (
                <div className="border rounded-2xl p-6 md:p-8 bg-card shadow-sm space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold leading-relaxed">
                            {currentQuestion}
                        </h2>
                    </div>

                    <div className="space-y-2">
                        <textarea
                            value={currentAnswer}
                            onChange={(e) => setCurrentAnswer(e.target.value)}
                            placeholder="Type your detailed answer here..."
                            className="min-h-[250px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            {currentAnswer.length} characters
                        </p>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button onClick={handleNext} disabled={!currentAnswer.trim() || submitting} className="gap-2">
                            {isLastQuestion ? "Submit Interview" : "Next Question"}
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InterviewSessionPage;
