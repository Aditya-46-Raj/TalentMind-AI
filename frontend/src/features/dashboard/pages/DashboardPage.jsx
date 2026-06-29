import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function DashboardPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 border rounded-xl shadow-sm bg-card">
          <h2 className="text-xl font-semibold mb-2">Job Match Engine</h2>
          <p className="text-muted-foreground mb-4">Analyze a Job Description against your Resume to get your ATS Score and missing skills.</p>
          <Link to="/job/analyze">
            <Button>Analyze Job</Button>
          </Link>
        </div>

        <div className="p-6 border rounded-xl shadow-sm bg-card bg-emerald-500/5 border-emerald-500/20">
          <h2 className="text-xl font-semibold mb-2 text-emerald-700 dark:text-emerald-400">AI Career Mentor</h2>
          <p className="text-muted-foreground mb-4">Chat with TalentMind AI to get highly personalized career advice, roadmaps, and tips based on your profile.</p>
          <Link to="/chat">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Ask AI Mentor</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;