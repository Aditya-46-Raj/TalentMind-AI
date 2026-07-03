import { useEffect, useState } from "react";
import useAuthStore from "@/features/auth/store/authStore";
import { getLatestResume } from "@/features/resume/services/resumeService";
import { getMyProfile, updateProfile } from "@/features/profile/services/profileService";
import { User, Mail, Calendar, FileText, Activity, ExternalLink, Briefcase, Loader2, Edit3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

function ProfilePage() {
    const { user } = useAuthStore();
    const [resumeData, setResumeData] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        headline: "",
        bio: "",
        targetRole: "",
        github: "",
        linkedin: ""
    });

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [resumeRes, profileRes] = await Promise.all([
                    getLatestResume().catch(() => null),
                    getMyProfile().catch(() => null)
                ]);

                if (resumeRes?.success && resumeRes.resume) {
                    setResumeData(resumeRes.resume);
                }

                if (profileRes?.success && profileRes.profile) {
                    setProfile(profileRes.profile);
                    setFormData({
                        headline: profileRes.profile.headline || "",
                        bio: profileRes.profile.bio || "",
                        targetRole: profileRes.profile.targetRole || "",
                        github: profileRes.profile.socialLinks?.github || "",
                        linkedin: profileRes.profile.socialLinks?.linkedin || ""
                    });
                }
            } catch (err) {
                console.error("Failed to load profile data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const dataToUpdate = {
                headline: formData.headline,
                bio: formData.bio,
                targetRole: formData.targetRole,
                socialLinks: {
                    github: formData.github,
                    linkedin: formData.linkedin
                }
            };
            const res = await updateProfile(dataToUpdate);
            if (res.success) {
                setProfile(res.profile);
                setIsEditing(false);
                toast.success("Profile updated successfully!");
            }
        } catch (err) {
            console.error("Failed to update profile", err);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500 relative">
            
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
                    <p className="text-muted-foreground mt-1">Manage your account and view your career stats</p>
                </div>
                <Button onClick={() => setIsEditing(true)} className="gap-2" disabled={loading}>
                    <Edit3 className="w-4 h-4" /> Edit Profile
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: User Info & Socials */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="border rounded-2xl bg-card p-6 shadow-sm flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden border-2 border-border mb-4">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-bold text-primary">
                                    {user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) : "TM"}
                                </span>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        
                        {loading ? (
                            <Skeleton className="h-4 w-32 mt-2" />
                        ) : profile?.headline && (
                            <p className="text-sm font-medium text-muted-foreground mt-1">{profile.headline}</p>
                        )}
                        
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-3 inline-block">
                            Pro Member
                        </span>

                        <div className="w-full space-y-3 pt-6 mt-6 border-t text-left">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Mail className="w-4 h-4 mr-3 shrink-0" />
                                <span className="truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4 mr-3 shrink-0" />
                                <span>Joined recently</span>
                            </div>
                            {loading ? (
                                <Skeleton className="h-4 w-full mt-2" />
                            ) : profile?.targetRole && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Briefcase className="w-4 h-4 mr-3 shrink-0" />
                                    <span className="truncate">Target: {profile.targetRole}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Social Links */}
                    {loading ? (
                        <div className="border rounded-2xl bg-card p-6 shadow-sm space-y-4">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ) : (profile?.socialLinks?.github || profile?.socialLinks?.linkedin) && (
                        <div className="border rounded-2xl bg-card p-6 shadow-sm">
                            <h3 className="font-semibold mb-4">Social Links</h3>
                            <div className="space-y-3">
                                {profile.socialLinks.github && (
                                    <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                                        <ExternalLink className="w-5 h-5 text-muted-foreground" />
                                        <span className="truncate">{profile.socialLinks.github}</span>
                                    </a>
                                )}
                                {profile.socialLinks.linkedin && (
                                    <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                                        <ExternalLink className="w-5 h-5 text-muted-foreground" />
                                        <span className="truncate">{profile.socialLinks.linkedin}</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Bio & Stats */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Bio Section */}
                    <div className="border rounded-2xl p-6 bg-card shadow-sm">
                        <h3 className="text-lg font-semibold mb-3">About Me</h3>
                        {loading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        ) : profile?.bio ? (
                            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                                {profile.bio}
                            </p>
                        ) : (
                            <p className="text-muted-foreground text-sm italic">
                                No bio provided yet. Click "Edit Profile" to add one!
                            </p>
                        )}
                    </div>

                    {/* Stats Section */}
                    <h3 className="text-lg font-semibold pt-2">Career Stats</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="border rounded-2xl p-5 bg-card shadow-sm flex items-center gap-4 hover:border-blue-500/30 transition-colors">
                            <div className="p-3 bg-blue-500/10 rounded-xl shrink-0">
                                <FileText className="w-7 h-7 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Latest ATS Score</p>
                                {loading ? (
                                    <Skeleton className="h-8 w-16 mt-1" />
                                ) : (
                                    <h3 className="text-3xl font-bold mt-1">
                                        {resumeData ? `${resumeData.atsScore}%` : "N/A"}
                                    </h3>
                                )}
                            </div>
                        </div>

                        <div className="border rounded-2xl p-5 bg-card shadow-sm flex items-center gap-4 hover:border-emerald-500/30 transition-colors">
                            <div className="p-3 bg-emerald-500/10 rounded-xl shrink-0">
                                <Activity className="w-7 h-7 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Extracted Skills</p>
                                {loading ? (
                                    <Skeleton className="h-8 w-16 mt-1" />
                                ) : (
                                    <h3 className="text-3xl font-bold mt-1">
                                        {resumeData?.skills ? resumeData.skills.length : "0"}
                                    </h3>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Account Settings */}
                    <div className="border rounded-2xl p-6 bg-destructive/5 shadow-sm mt-4">
                        <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                        <Button variant="outline" className="text-destructive hover:bg-destructive hover:text-white transition-colors border-destructive/20">
                            Delete Account
                        </Button>
                    </div>
                </div>

            </div>

            {/* Edit Profile Modal/Overlay */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-2xl border rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold">Edit Profile</h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)} className="rounded-full">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            <form id="profile-form" onSubmit={handleSave} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="headline">Headline</Label>
                                    <Input 
                                        id="headline" 
                                        name="headline" 
                                        value={formData.headline} 
                                        onChange={handleChange} 
                                        placeholder="e.g. Full Stack Developer | React Enthusiast" 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <textarea 
                                        id="bio"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                                        placeholder="Tell us a little bit about yourself..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="targetRole">Target Role</Label>
                                    <Input 
                                        id="targetRole" 
                                        name="targetRole" 
                                        value={formData.targetRole} 
                                        onChange={handleChange} 
                                        placeholder="e.g. Software Engineer, Frontend Developer" 
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="github">GitHub URL</Label>
                                        <Input 
                                            id="github" 
                                            name="github" 
                                            value={formData.github} 
                                            onChange={handleChange} 
                                            placeholder="https://github.com/yourusername" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="linkedin">LinkedIn URL</Label>
                                        <Input 
                                            id="linkedin" 
                                            name="linkedin" 
                                            value={formData.linkedin} 
                                            onChange={handleChange} 
                                            placeholder="https://linkedin.com/in/yourusername" 
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t bg-muted/20 flex justify-end gap-3 rounded-b-2xl">
                            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={saving}>
                                Cancel
                            </Button>
                            <Button type="submit" form="profile-form" disabled={saving}>
                                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default ProfilePage;