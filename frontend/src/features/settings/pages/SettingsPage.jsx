import { useState, useRef, useEffect } from "react";
import useAuthStore from "@/features/auth/store/authStore";
import { uploadAvatar } from "@/features/auth/services/authService";
import { Button } from "@/components/ui/button";
import { LogOut, Upload, Moon, Sun, Monitor, User as UserIcon, Loader2, Info } from "lucide-react";
import { toast } from "sonner";

function SettingsPage() {
    const { user, logout, updateAvatar } = useAuthStore();
    const [uploading, setUploading] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");
    const fileInputRef = useRef(null);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const applyTheme = (selectedTheme) => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        if (selectedTheme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            root.classList.add(systemTheme);
        } else {
            root.classList.add(selectedTheme);
        }
        localStorage.setItem("theme", selectedTheme);
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        toast.success(`Theme updated to ${newTheme}`);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        // Limit to 2MB to prevent huge base64 strings
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be smaller than 2MB");
            return;
        }

        setUploading(true);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            try {
                const base64String = reader.result;
                const res = await uploadAvatar(base64String);
                if (res.success) {
                    updateAvatar(res.user.avatar);
                    toast.success("Profile picture updated!");
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to upload profile picture");
            } finally {
                setUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        };
    };

    if (!user) return null;

    const initials = user.name
        ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
        : "TM";

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500 pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your account preferences and application settings.</p>
            </div>

            <div className="space-y-6">
                
                {/* Profile Section */}
                <div className="border rounded-2xl p-6 bg-card shadow-sm space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <UserIcon className="w-5 h-5" /> Profile
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">Update your personal information and avatar.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-6 py-4 border-t border-b">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-border">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-bold text-primary">{initials}</span>
                                )}
                            </div>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-md hover:bg-primary/90 transition-colors"
                            >
                                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                accept="image/*" 
                                className="hidden" 
                            />
                        </div>
                        <div className="text-center sm:text-left">
                            <h3 className="font-semibold text-lg">{user.name}</h3>
                            <p className="text-muted-foreground text-sm">{user.email}</p>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-3"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                Change Avatar
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Appearance Section */}
                <div className="border rounded-2xl p-6 bg-card shadow-sm space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold">Appearance</h2>
                        <p className="text-sm text-muted-foreground mt-1">Customize how TalentMind AI looks on your device.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 border-t pt-6">
                        <button 
                            onClick={() => handleThemeChange("light")}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                        >
                            <Sun className="w-6 h-6 mb-2" />
                            <span className="text-sm font-medium">Light</span>
                        </button>
                        <button 
                            onClick={() => handleThemeChange("dark")}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                        >
                            <Moon className="w-6 h-6 mb-2" />
                            <span className="text-sm font-medium">Dark</span>
                        </button>
                        <button 
                            onClick={() => handleThemeChange("system")}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                        >
                            <Monitor className="w-6 h-6 mb-2" />
                            <span className="text-sm font-medium">System</span>
                        </button>
                    </div>
                </div>

                {/* About Section */}
                <div className="border rounded-2xl p-6 bg-card shadow-sm space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Info className="w-5 h-5" /> About TalentMind AI
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        TalentMind AI is an intelligent career acceleration platform designed to bridge the gap between job seekers and employers. Built with React, Node.js, and powered by Google Gemini AI, it provides personalized resume analysis, job matching, and AI mock interviews.
                    </p>
                    <div className="text-sm text-muted-foreground pt-4 border-t">
                        Version 1.0.0
                    </div>
                </div>

                {/* Account Section */}
                <div className="border rounded-2xl p-6 bg-destructive/5 shadow-sm space-y-4 border-destructive/20">
                    <h2 className="text-lg font-semibold text-destructive">Account Actions</h2>
                    <p className="text-sm text-muted-foreground">Log out of your current session.</p>
                    <Button onClick={logout} variant="destructive" className="gap-2 w-full sm:w-auto">
                        <LogOut className="w-4 h-4" /> Log out securely
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;
