import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getLatestResume, uploadResume } from "../../resume/services/resumeService";
import { analyzeJob } from "../services/jobService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
            // It's normal to get 404 if no resume uploaded yet
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
        <div className="max-w-2xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold">JD Analyzer & Match Engine</h1>
            
            {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {/* Resume Section */}
            <div className="p-6 bg-gray-50 border rounded-lg space-y-4">
                <h2 className="text-xl font-semibold">Your Resume</h2>
                
                {isLoading ? (
                    <p>Loading resume...</p>
                ) : resume ? (
                    <div className="flex items-center justify-between bg-white p-4 rounded border">
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-800">{resume.fileName}</span>
                            <span className="text-sm text-gray-500">
                                Uploaded on {new Date(resume.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <Button 
                            variant="outline" 
                            onClick={handleReplaceClick}
                            disabled={isUploading || isAnalyzing}
                        >
                            {isUploading ? "Uploading..." : "Replace Resume"}
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-start space-y-4">
                        <p className="text-gray-600">No resume found. You must upload one before analyzing a job.</p>
                        <Button 
                            onClick={handleReplaceClick}
                            disabled={isUploading || isAnalyzing}
                        >
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
            <form onSubmit={handleAnalyze} className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold">Job Description Details</h2>
                
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
                        className="w-full min-h-[200px] flex rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Paste the full job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        required
                    />
                </div>

                <Button 
                    type="submit" 
                    className="w-full"
                    disabled={!resume || isAnalyzing || isUploading}
                >
                    {isAnalyzing ? "Analyzing Match..." : "Analyze Match"}
                </Button>
            </form>
        </div>
    );
}

export default JDInputPage;
