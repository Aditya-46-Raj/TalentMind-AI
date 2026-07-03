import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

function RegisterPage() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
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
            const res = await registerUser(formData);
            if (res.success) {
                import("sonner").then(({ toast }) => toast.success("Account created successfully! Please log in."));
                navigate("/login");
            }
        } catch (err) {
            console.error("Register Full Error:", err);
            const apiMsg = err.response?.data?.message;
            const netMsg = err.message;
            setError(apiMsg || netMsg || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-center mb-6">
                <h2 className="text-xl font-semibold tracking-tight">Create an account</h2>
                <p className="text-sm text-muted-foreground">Start your career acceleration journey</p>
            </div>

            {error && (
                <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                        id="name" 
                        name="name"
                        type="text" 
                        placeholder="John Doe" 
                        value={formData.name}
                        onChange={handleChange}
                        required 
                    />
                </div>

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
                    <Label htmlFor="password">Password</Label>
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
                {loading ? "Creating account..." : "Sign up"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-primary hover:underline">
                    Sign in
                </Link>
            </div>
        </form>
    );
}

export default RegisterPage;