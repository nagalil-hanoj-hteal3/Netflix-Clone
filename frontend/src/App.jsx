import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/home/HomePage";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authUser.js";
import { useEffect } from "react";
import WatchPage from "./pages/WatchPage";
import SearchPage from "./pages/SearchPage";
import HistoryPage from "./pages/HistoryPage.jsx";
import NotFound from "./pages/NotFound";

import ActorPage from "./pages/ActorPage.jsx";
import MoreInfoPage from "./pages/MoreInfoPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import TrendingPage from "./pages/TrendingPage.jsx";
import BookmarksPage from "./pages/BookmarksPage.jsx";
import CollectionsPage from "./pages/CollectionsPage.jsx";
import PersonPage from "./pages/PersonPage.jsx";

import AuthLoadingScreen from "./components/skeletons/AuthLoading.jsx";

function App() {
  const {user, isCheckingAuth, authCheck} = useAuthStore();
  // console.log(user, isCheckingAuth);

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  // this is the loading spinner for authentication purposes
  if(isCheckingAuth){
    return (<AuthLoadingScreen/>)
  }

  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      
      {/* if logged in and user wants to go to signup route -> navigate them to home page */}
      <Route path="/login" element={!user ? <LoginPage/> : <Navigate to={"/"}/>}/>

      {/* if not authenticated, show sign up page, if authenticated -> navigate them to home page */}
      <Route path="/signup" element={!user ? <SignupPage/> : <Navigate to={"/"}/>}/> 

      {/* Check if the user is logged in to use the watch page */}
      <Route path="/watch/:id" element={user ? <WatchPage/> : <Navigate to={"/"}/>}/>

      {/* Check if the user is logged in to use the search page */}
      <Route path="/search" element={user ? <SearchPage/> : <Navigate to={"/login"}/>}/>

      <Route path="/history" element={user ? <HistoryPage/> : <Navigate to={"/login"}/>}/>

      <Route path="/*" element={<NotFound/>}/>

      <Route path="/actor/:id" element={user ? <ActorPage/> : <Navigate to={"/"}/>}/>

      <Route path="/:type/moreinfo/:id" element={user ? <MoreInfoPage/> : <Navigate to={"/"}/>}/>

      <Route path="/account" element={user ? <AccountPage/> : <Navigate to={"/"}/>}/>

      <Route path="/trending" element={user ? <TrendingPage/> : <Navigate to={"/"}/>}/>
      
      <Route path="/bookmark" element={user ? <BookmarksPage/> : <Navigate to={"/"}/>}/>

      <Route path="/collection/:id" element={user ? <CollectionsPage/> : <Navigate to={"/"}/>}/>

      <Route path="/person" element={user ? <PersonPage/> : <Navigate to={"/"}/>}/>

    </Routes>
    <Toaster/>
    <Footer/>
    </>
  )
}

export default App;