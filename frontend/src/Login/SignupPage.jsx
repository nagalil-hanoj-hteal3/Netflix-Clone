import {Link} from "react-router-dom";

function SignupPage() {
  return (
    <div className="h-screen w-full hero-bg">
        <header className="max-w-6xl mx-auto flex items-center justify-between p-4">
            <Link to={"/"}>
                <img src="/netflix-logo.png" alt="logo" className="w-52"/>
            </Link>
        </header>

        <div className="flex justify-center items-center mt-20 mx-3">
            <div className="w-full max-w-md p-8 space-y-6 bg-black/60 rounded-lg shadow-md">
                <h1 className="text-center text-white text-2x1 font-bold mb-4">
                    Sign Up
                </h1>

                <form className="space-y-4">
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-300 block">
                            Email
                        </label>
                        <input type="email"
                        className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white
                        focus:outline-none focus:ring" placeholder="john.doe@gmail.com" id="email"/>

                    </div>
                </form>

            </div>
        </div>

    </div>
  )
}

export default SignupPage