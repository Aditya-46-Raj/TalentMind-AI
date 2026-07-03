import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import useAuthStore from "../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

function LoginPage() {
    const navigate = useNavigate();
    const { setToken, checkAuth } = useAuthStore();
    
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            const res = await loginUser(formData);
            if (res.success) {
                setToken(res.token);
                await checkAuth();
                import("sonner").then(({ toast }) => toast.success("Welcome back!"));
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Login Full Error:", err);
            const apiMsg = err.response?.data?.message;
            const netMsg = err.message;
            setError(apiMsg || netMsg || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-center mb-6">
                <h2 className="text-xl font-semibold tracking-tight">Welcome back</h2>
                <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
            </div>

            {error && (
                <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        placeholder="you@example.com" 
                        value={formData.email}
                        onChange={handleChange}
                        required 
                    />
                </div>
                
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                    </div>
                    <Input 
                        id="password" 
                        name="password"
                        type="password" 
                        placeholder="••••••••" 
                        value={formData.password}
                        onChange={handleChange}
                        required 
                    />
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {loading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-primary hover:underline">
                    Sign up
                </Link>
            </div>
        </form>
    );
}

export default LoginPage;