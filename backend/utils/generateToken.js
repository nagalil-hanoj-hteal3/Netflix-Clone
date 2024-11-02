import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, ENV_VARS.JWT_SECRET, {expiresIn: "15d"});

    res.cookie("jwt-netflix", token,{
        maxAge: 15 * 24 * 60 * 60 * 1000, // in 15 days in Milliseconds
        httpOnly: true, // prevent cross site scripting (XSS) attacks - not accessible by javascript
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: ENV_VARS.NODE_ENV !== "development",
    });

    return token;
    
}