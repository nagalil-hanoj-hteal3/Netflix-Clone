import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authUser.js";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login} = useAuthStore();

  const [backgroundClass, setBackgroundClass] = useState("hero-bg");
  const [fadeClass, setFadeClass] = useState("fade-in");

  const handleLogin = (e) => {
    e.preventDefault();
    // console.log(email, password);
    login({email, password});
  };

  useEffect(() => {
    const interval = setInterval(() => {
        setFadeClass("fade-out");

        setTimeout(() => {
            setBackgroundClass((prevClass) =>
                prevClass === "hero-bg" ? "hero2-bg" : "hero-bg"
            );
            setFadeClass("fade-in");
        }, 50);
        }, 5000);
    return () => clearInterval(interval);
  });

  return (
    <div className={`${backgroundClass} ${fadeClass} relative transition-opacity duration-500 min-h-screen w-full`}>
        <header className="max-w-8xl mx-auto flex items-center justify-between p-4">
            <Link to={"/"}>
                <img src="/netflix-logo.png" alt="logo" className="w-52"/>
            </Link>
        </header>

        <div className="flex justify-center items-center mt-20 mx-3">
            <div className="w-full max-w-md p-8 space-y-6 bg-black/65 rounded-lg shadow-md">
                <h1 className="text-center text-white text-2x1 font-bold mb-4">
                    Login
                </h1>

                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-300 block">
                            Email
                        </label>
                        <input type="email"
                        className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white
                        focus:outline-none focus:ring" placeholder="john.doe@gmail.com" id="email"
                        value={email} onChange={(e) => setEmail(e.target.value)}/>

                    </div>

                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-300 block">
                            Password
                        </label>
                        <input type="password"
                        className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white
                        focus:outline-none focus:ring" placeholder="******" id="password"
                        value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <button className="w-full py-2 bg-red-600 text-white font-semibold rounded-md
                        hover:bg-red-800">
                        Login
                    </button>

                    <div className="text-center text-gray-400">
                        Don't have an account?{" "}
                        <Link to={"/signup"} className="text-red-600 hover:underline">Sign Up
                        </Link>
                    </div>

                </form>

            </div>
        </div>

    </div>
  )
}

export default LoginPage