import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authUser.js";
import { ChevronRight, Lock, Mail } from "lucide-react";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [imgLoading, setImgLoading] = useState(true);
    
    const { login, isLoggingIn } = useAuthStore();

    const handleLogin = (e) => {
        e.preventDefault();
        login({ email, password });
    };

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Hero Section with Background Image */}
            <div className="relative min-h-screen">
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full">
                    {imgLoading && (
                        <div className="absolute inset-0 bg-blue-900/30 animate-pulse" />
                    )}
                    <img
                        src="background3.jpg"
                        alt="Background"
                        className="w-full h-full object-cover"
                        onLoad={() => setImgLoading(false)}
                    />
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
                </div>

                {/* Login Form Section */}
                <div className="relative z-10 container mx-auto px-4 lg:px-8 py-12 flex flex-col items-center justify-center min-h-screen">
                    <div className="w-full max-w-xl bg-slate-900/80 backdrop-blur-sm rounded-xl p-8 border border-slate-800">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-6 text-center">
                            Welcome Back
                        </h1>

                        {/* Login Guidelines */}
                        <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                            <h2 className="text-blue-200 font-semibold mb-2">Login Information:</h2>
                            <p className="text-slate-300 text-sm">
                                Enter your email and password to access your account. If you've forgotten your password, please contact support.
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label htmlFor="email" className="text-sm font-medium text-blue-200 block mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                                    <input
                                        type="email"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="john.doe@gmail.com"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="text-sm font-medium text-blue-200 block mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                                    <input
                                        type="password"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="******"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoggingIn}
                            >
                                {isLoggingIn ? "Logging in..." : "Login"}
                                <ChevronRight className="size-5" />
                            </button>

                            <div className="text-center text-slate-300">
                                Don't have an account?{" "}
                                <Link to="/signup" className="text-blue-400 hover:text-blue-300 hover:underline">
                                    Sign up
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;