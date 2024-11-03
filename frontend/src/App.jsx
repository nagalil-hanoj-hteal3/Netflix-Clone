import { Route, Routes } from "react-router-dom";
import LoginPage from "./Login/LoginPage";
import SignupPage from "./Login/SignupPage";
import HomePage from "./Login/HomePage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/signup" element={<SignupPage/>}/>
    </Routes>
  )
}

export default App;