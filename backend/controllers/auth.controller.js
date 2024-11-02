import { User } from '../models/user.model.js';
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from '../utils/generateToken.js';

export async function signup(req, res) {

    try {
        const {email, password, username} = req.body;

        if(!email || !password || !username) 
            return res.status(400).json({success:false, message:"All fields required"});

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email))
            return res.status(400).json({success:false, message:"Invalid email"});

        if(password.length < 6)
            return res.status(400).json({success:false, message:"Password must be more than 6 characters."});

        const existingUserEmail = await User.findOne({
            email: email
        });

        if (existingUserEmail) {
            return res.status(400).json({success:false, message:"Email already exists"});
        }

        const existingUsername = await User.findOne({
            username: username
        });

        if (existingUsername) {
            return res.status(400).json({success:false, message:"Username already exists"});
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const PROFILE_PICS = ["", "", ""];
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            image
        });

        generateTokenAndSetCookie(newUser._id, res)
        await newUser.save();    

        // Remove password from response
        res.status(201).json({sucess: true, user: {
            ...newUser_doc,
            password:""
        }});

    } catch (error) {
        console.log("Error in signup controller");
        res.status(500).json({success:false, message:"Internal server error"});
    }

    // res.send("Signup route");
}

export async function login(req, res) {
    
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({success:false, message:"All fields are required"});
        }

        const user = await User.findOne({email: email});
        if(!user){
            return res.status(404).json({success:false, message:"Invalid credentials"});
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(404).json({success:false, message:"Invalid credentials"});
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: ""
            }
        });

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({success:false, message:"Internal server error"});
    }
    // res.send("Login route");
}

export async function logout(req, res) {

    // clear out the cookies
    try {
        res.clearCookie("jwt-netflix");
        res.status(200).json({success: true, message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({success:false, message:"Internal server error"});
    }
    // res.send("Logout route");
}