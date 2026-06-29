import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startInterview } from "../services/interviewService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mic } from "lucide-react";

function InterviewSetupPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        role: "",
        company: "",
        difficulty: "Medium"
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await startInterview(formData);
            if (res.success && res.session) {
                navigate(`/interview/session/${res.session._id}`);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to start interview. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
            <div className="flex flex-col items-center text-center space-y-4 mb-8">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                    <Mic className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">AI Mock Interview</h1>
                    <p className="text-muted-foreground mt-2">
                        Configure your interview settings. The AI will analyze your resume and generate targeted questions.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="border rounded-2xl p-6 bg-card shadow-sm space-y-6">
                {error && (
                    <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="role">Target Role <span className="text-destructive">*</span></Label>
                    <Input 
                        id="role"
                        name="role"
                        placeholder="e.g. Full Stack Developer, Data Scientist"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="company">Target Company (Optional)</Label>
                    <Input 
                        id="company"
                        name="company"
                        placeholder="e.g. Google, Amazon, Startup"
                        value={formData.company}
                        onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground">The AI will tailor questions to this company's interview style.</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <select 
                        id="difficulty"
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="Beginner">Beginner</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                        <option value="Expert">Expert (FAANG Level)</option>
                    </select>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {loading ? "Generating Questions..." : "Start Interview"}
                </Button>
            </form>
        </div>
    );
}

export default InterviewSetupPage;
