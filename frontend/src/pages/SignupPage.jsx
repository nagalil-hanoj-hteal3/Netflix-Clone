import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authUser.js";
import { ChevronRight, UserCircle2, Lock, Mail, UserCheck, CheckCircle2, XCircle } from "lucide-react";
import { validateUsername } from "../utils/profanityFilter.js";

function SignupPage() {
    const { searchParams } = new URL(document.location);
    const emailValue = searchParams.get("email");

    const [email, setEmail] = useState(emailValue || "");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordStrength, setPasswordStrength] = useState("");
    const [imgLoading, setImgLoading] = useState(true);

    const [usernameError, setUsernameError] = useState("");

    const handleUsernameChange = (e) => {
        const newUsername = e.target.value;
        setUsername(newUsername);

        // Validate username in real-time
        const validationResult = validateUsername(newUsername);
        if (!validationResult.isValid) {
            setUsernameError(validationResult.message);
        } else {
            setUsernameError("");
        }
    };

    const { signup, isSigningUp } = useAuthStore();

    const handleSignUp = (e) => {
        e.preventDefault();

        // Perform final validation before signup
        const usernameValidation = validateUsername(username);
        if (!usernameValidation.isValid) {
            setUsernameError(usernameValidation.message);
            return;
        }

        signup({ email, username, password, confirmPassword });
    }

    const passwordRequirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[@$!%*?&]/.test(password)
    };

    const checkPasswordStrength = (pass) => {
        const requirements = {
            length: pass.length >= 8,
            uppercase: /[A-Z]/.test(pass),
            lowercase: /[a-z]/.test(pass),
            number: /\d/.test(pass),
            special: /[@$!%*?&]/.test(pass)
        };

        const metRequirements = Object.values(requirements).filter(req => req).length;

        if (metRequirements === 5) {
            setPasswordStrength("Strong");
        } else if (metRequirements >= 3) {
            setPasswordStrength("Intermediate");
        } else {
            setPasswordStrength("Weak");
        }
    }

    useEffect(() => {
        checkPasswordStrength(password);
    }, [password]);

    // eslint-disable-next-line react/prop-types
    const RequirementItem = ({ met, text }) => (
        <div className="flex items-center gap-2">
            {met ? (
                <CheckCircle2 className="text-green-400 size-4" />
            ) : (
                <XCircle className="text-red-400 size-4" />
            )}
            <span className={`text-sm ${met ? 'text-green-400' : 'text-slate-400'}`}>
                {text}
            </span>
        </div>
    );

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
                        src="/background2.jpg"
                        alt="Background"
                        className="w-full h-full object-cover"
                        onLoad={() => setImgLoading(false)}
                    />
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
                </div>

                {/* Signup Form Section */}
                <div className="relative z-10 container mx-auto px-4 lg:px-8 py-12 flex flex-col items-center justify-center min-h-screen">
                    <div className="w-full max-w-xl bg-slate-900/80 backdrop-blur-sm rounded-xl p-8 border border-slate-800">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-6 text-center">
                            Create Your Account
                        </h1>

                        {/* Account Creation Guidelines */}
                        <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                            <h2 className="text-blue-200 font-semibold mb-2">Account Requirements:</h2>
                            <ul className="text-slate-300 text-sm space-y-1">
                                <li>• Valid email address required and must be unique</li>
                                <li>• Username must be unique and between 3-20 characters</li>
                                <li>• Passwords must match and meet the requirements below</li>
                            </ul>
                        </div>

                        <form className="space-y-6" onSubmit={handleSignUp}>
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
                                <label htmlFor="username" className="text-sm font-medium text-blue-200 block mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="john.doe"
                                        id="username"
                                        value={username}
                                        onChange={handleUsernameChange}
                                        required
                                        minLength={3}
                                        maxLength={20}
                                    />
                                </div>
                                {usernameError && (
                                    <p className="text-red-400 text-sm mt-2">{usernameError}</p>
                                )}
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
                                
                                {/* Password Requirements Checklist */}
                                <div className="mt-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                    <h3 className="text-blue-200 font-semibold mb-2">Password Requirements:</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <RequirementItem met={passwordRequirements.length} text="At least 8 characters" />
                                        <RequirementItem met={passwordRequirements.uppercase} text="One uppercase letter" />
                                        <RequirementItem met={passwordRequirements.lowercase} text="One lowercase letter" />
                                        <RequirementItem met={passwordRequirements.number} text="One number" />
                                        <RequirementItem met={passwordRequirements.special} text="One special character (@$!%*?&)" />
                                    </div>
                                    <p className={`text-sm mt-2 font-medium ${
                                        passwordStrength === "Strong" 
                                            ? "text-green-400" 
                                            : passwordStrength === "Intermediate" 
                                                ? "text-yellow-400" 
                                                : "text-red-400"
                                    }`}>
                                        Password Strength: {passwordStrength}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="text-sm font-medium text-blue-200 block mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                                    <input
                                        type="password"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="******"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                {confirmPassword && password !== confirmPassword && (
                                    <p className="text-red-400 text-sm mt-2">Passwords do not match</p>
                                )}
                            </div>

                            <button
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSigningUp || password !== confirmPassword || !validateUsername(username).isValid}
                            >
                                {isSigningUp ? "Creating Account..." : "Create Account"}
                                <ChevronRight className="size-5" />
                            </button>

                            <div className="text-center text-slate-300">
                                Already have an account?{" "}
                                <Link to="/login" className="text-blue-400 hover:text-blue-300 hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;