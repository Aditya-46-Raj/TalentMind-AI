import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getJobAnalysisById } from "../services/jobService";
import { Button } from "@/components/ui/button";

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
        return <div className="p-6 text-center">Loading analysis results...</div>;
    }

    if (error) {
        return (
            <div className="p-6 text-center space-y-4">
                <div className="text-red-600">{error}</div>
                <Link to="/job/analyze">
                    <Button>Go Back</Button>
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

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Analysis Results</h1>
                    <p className="text-gray-500 text-lg mt-1">{jobTitle} at {company}</p>
                </div>
                <Link to="/job/analyze">
                    <Button variant="outline">Analyze Another Job</Button>
                </Link>
            </div>

            {/* Match Score */}
            <div className="bg-white p-8 rounded-lg border shadow-sm text-center">
                <h2 className="text-xl font-semibold mb-2">Match Score</h2>
                <div className={`text-6xl font-bold ${matchScore >= 70 ? 'text-green-600' : matchScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {matchScore}%
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Matched Skills */}
                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                    <h2 className="text-lg font-semibold text-green-800 mb-4">Matched Skills ({matchedSkills.length})</h2>
                    <div className="flex flex-wrap gap-2">
                        {matchedSkills.length > 0 ? matchedSkills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm">
                                {skill}
                            </span>
                        )) : (
                            <p className="text-sm text-gray-500">No matched skills found.</p>
                        )}
                    </div>
                </div>

                {/* Missing Skills */}
                <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                    <h2 className="text-lg font-semibold text-red-800 mb-4">Missing Skills ({missingSkills.length})</h2>
                    <div className="flex flex-wrap gap-2">
                        {missingSkills.length > 0 ? missingSkills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm">
                                {skill}
                            </span>
                        )) : (
                            <p className="text-sm text-gray-500">No missing skills found. Great match!</p>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Analysis */}
            {analysis && (
                <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
                    <h2 className="text-2xl font-bold border-b pb-2">AI Feedback</h2>
                    
                    <div>
                        <h3 className="text-lg font-semibold text-green-700 mb-2">Strengths</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            {analysis.strengths?.map((item, i) => (
                                <li key={i} className="text-gray-700">{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-red-700 mb-2">Weaknesses</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            {analysis.weaknesses?.map((item, i) => (
                                <li key={i} className="text-gray-700">{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-blue-700 mb-2">Suggestions</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            {analysis.suggestions?.map((item, i) => (
                                <li key={i} className="text-gray-700">{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Roadmap */}
            {roadmap && roadmap.length > 0 && (
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-100 space-y-4">
                    <h2 className="text-2xl font-bold text-purple-900 border-b border-purple-200 pb-2">Your Personalized Roadmap</h2>
                    <div className="space-y-4">
                        {roadmap.map((step, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                                    {index + 1}
                                </div>
                                <div className="pt-1 text-gray-800">
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
