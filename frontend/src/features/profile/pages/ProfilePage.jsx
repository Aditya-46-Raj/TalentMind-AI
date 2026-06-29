import { useEffect, useState } from "react";
import useAuthStore from "@/features/auth/store/authStore";
import { getLatestResume } from "@/features/resume/services/resumeService";
import { User, Mail, Calendar, FileText, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

function ProfilePage() {
    const { user } = useAuthStore();
    const [resumeData, setResumeData] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getLatestResume();
                if (res.success && res.resume) {
                    setResumeData(res.resume);
                }
            } catch (err) {
                console.error("Failed to load profile stats", err);
            }
        };
        fetchStats();
    }, []);

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
                <p className="text-muted-foreground mt-1">Manage your account and view your career stats</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* User Info Card */}
                <div className="md:col-span-1 border rounded-2xl bg-card p-6 shadow-sm space-y-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-12 h-12 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{user.name}</h2>
                            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 mt-2 inline-block">Pro Member</span>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center text-sm">
                            <Mail className="w-4 h-4 text-muted-foreground mr-3" />
                            <span>{user.email}</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground mr-3" />
                            <span>Joined recently</span>
                        </div>
                    </div>
                </div>

                {/* Stats & Actions */}
                <div className="md:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="border rounded-xl p-5 bg-card shadow-sm flex items-start gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg shrink-0">
                                <FileText className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Latest ATS Score</p>
                                <h3 className="text-2xl font-bold mt-1">
                                    {resumeData ? `${resumeData.atsScore}%` : "N/A"}
                                </h3>
                            </div>
                        </div>

                        <div className="border rounded-xl p-5 bg-card shadow-sm flex items-start gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-lg shrink-0">
                                <Activity className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Extracted Skills</p>
                                <h3 className="text-2xl font-bold mt-1">
                                    {resumeData?.skills ? resumeData.skills.length : "0"}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="border rounded-xl p-6 bg-card shadow-sm">
                        <h3 className="font-semibold mb-4">Account Settings</h3>
                        <p className="text-sm text-muted-foreground mb-4">Your account is currently managed securely by TalentMind AI.</p>
                        <div className="flex gap-3">
                            <Button variant="outline">Edit Profile</Button>
                            <Button variant="outline" className="text-destructive hover:bg-destructive/10">Delete Account</Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ProfilePage;