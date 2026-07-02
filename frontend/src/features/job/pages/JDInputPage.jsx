import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getLatestResume, uploadResume } from "../../resume/services/resumeService";
import { analyzeJob } from "../services/jobService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, FileText, Briefcase } from "lucide-react";

function JDInputPage() {
    const [resume, setResume] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    const [jobTitle, setJobTitle] = useState("");
    const [company, setCompany] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [error, setError] = useState(null);

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLatestResume();
    }, []);

    const fetchLatestResume = async () => {
        setIsLoading(true);
        try {
            const data = await getLatestResume();
            if (data.success) {
                setResume(data.resume);
            }
        } catch (err) {
            console.error("Error fetching resume", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReplaceClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append("resume", file);
            const data = await uploadResume(formData);
            if (data.success) {
                setResume(data.resume);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to upload resume");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        
        if (!resume) {
            setError("Please upload a resume first.");
            return;
        }

        if (!jobTitle || !company || !jobDescription) {
            setError("Please fill in all job details.");
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        try {
            const data = await analyzeJob({
                jobTitle,
                company,
                jobDescription
            });

            if (data.success) {
                navigate(`/job/results/${data.jobAnalysis._id}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to analyze job");
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col items-center text-center space-y-4 mb-4">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                    <Briefcase className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">JD Analyzer & Match Engine</h1>
                    <p className="text-muted-foreground mt-2">
                        Upload your resume and paste a job description to get your ATS match score.
                    </p>
                </div>
            </div>
            
            {error && (
                <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">
                    {error}
                </div>
            )}

            {/* Resume Section */}
            <div className="p-6 bg-muted/30 border rounded-2xl shadow-sm space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    Your Resume
                </h2>
                
                {isLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading resume...
                    </div>
                ) : resume ? (
                    <div className="flex items-center justify-between bg-card p-4 rounded-xl border">
                        <div className="flex flex-col">
                            <span className="font-medium text-foreground">{resume.fileName}</span>
                            <span className="text-sm text-muted-foreground">
                                Uploaded on {new Date(resume.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <Button 
                            variant="outline" 
                            onClick={handleReplaceClick}
                            disabled={isUploading || isAnalyzing}
                            className="gap-2"
                        >
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            {isUploading ? "Uploading..." : "Replace"}
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-4 py-8 border-2 border-dashed rounded-xl bg-card/50">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <p className="text-muted-foreground text-sm">No resume found. Upload one to start.</p>
                        <Button 
                            onClick={handleReplaceClick}
                            disabled={isUploading || isAnalyzing}
                            className="gap-2"
                        >
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            {isUploading ? "Uploading..." : "Upload Resume"}
                        </Button>
                    </div>
                )}
                
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    accept="application/pdf"
                    className="hidden"
                />
            </div>

            {/* Job Details Section */}
            <form onSubmit={handleAnalyze} className="space-y-6 bg-card p-6 rounded-2xl border shadow-sm">
                <h2 className="text-lg font-semibold">Job Description Details</h2>
                
                <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input 
                        id="jobTitle"
                        placeholder="e.g. Software Engineer"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input 
                        id="company"
                        placeholder="e.g. Google"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="jobDescription">Job Description</Label>
                    <textarea 
                        id="jobDescription"
                        className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                        placeholder="Paste the full job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        required
                    />
                </div>

                <Button 
                    type="submit" 
                    className="w-full gap-2"
                    disabled={!resume || isAnalyzing || isUploading}
                >
                    {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {isAnalyzing ? "Analyzing Match..." : "Analyze Match"}
                </Button>
            </form>
        </div>
    );
}

export default JDInputPage;
