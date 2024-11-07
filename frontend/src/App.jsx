import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/home/HomePage";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authUser.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { WatchPage } from "./pages/WatchPage.jsx";

function App() {
  const {user, isCheckingAuth, authCheck} = useAuthStore();
  console.log(user, isCheckingAuth);

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  // this is the loading spinner for authentication purposes
  if(isCheckingAuth){
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-black h-full">
          <Loader className="animate-spin text-red-600 size-10"/>
        </div>
      </div>
    )
  }

  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      
      {/* if logged in and user wants to go to signup route -> navigate them to home page */}
      <Route path="/login" element={!user ? <LoginPage/> : <Navigate to={"/"}/>}/>

      {/* if not authenticated, show sign up page, if authenticated -> navigate them to home page */}
      <Route path="/signup" element={!user ? <SignupPage/> : <Navigate to={"/"}/>}/> 

      {/* Check if the user is logged in  */}
      <Route path="/watch/:id" element={user ? <WatchPage/> : <Navigate to={"/"}/>}/>

    </Routes>
    <Toaster/>
    <Footer/>
    </>
  )
}

export default App;