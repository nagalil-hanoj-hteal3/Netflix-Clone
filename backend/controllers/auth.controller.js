import { User } from '../models/user.model.js';
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from '../utils/generateToken.js';

export async function signup(req, res) {

    try {
        const {email, password, confirmPassword, username} = req.body;

        if(!email || !password || !username || !confirmPassword) 
            return res.status(400).json({success:false, message:"All fields are required"});

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email))
            return res.status(400).json({success:false, message:"Invalid email"});

        // if(password.length < 6)
        //     return res.status(400).json({success:false, message:"Password must be more than 6 characters."});

        if(password !== confirmPassword)
            return res.status(400).json({ success: false, message: "Passwords do not match!" });

        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!strongPasswordRegex.test(password)) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character." });
        }

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

        const PROFILE_PICS = [
            "/avatar/avatar1.png", "/avatar2.jpg", "/avatar/avatar3.png", "/avatar/1.png", "/avatar/2.png", "/avatar/3.png", "/avatar/4.png",
            "/avatar/5.png", "/avatar/6.png", "/avatar/7.png", "/avatar/8.png", "/avatar/9.png", "/avatar/10.png", "/avatar/11.png", "/12.png", "/avatar/13.png",
            "/avatar/14.png", "/avatar/15.png", "/avatar/16.png", "/avatar/17.png", "/avatar/18.png", "/avatar/19.png", "/avatar/20.png", "/avatar/21.png", "/avatar/22.png",
            "/avatar/23.png", "/avatar/24.png", "/avatar/25.png", "/avatar/26.png", "/avatar/27.png", "/avatar/28.png", "/avatar/29.png", "/avatar/30.png", "/avatar/31.png",
            "/avatar/32.png", "/avatar/33.png", "/avatar/34.png", "/avatar/35.png", "/avatar/36.png", "/avatar/37.png", "/avatar/38.png", "/avatar/39.png", "/avatar/40.png",
            "/avatar/41.png", "/avatar/42.png", "/avatar/43.png", "/avatar/44.png", "/avatar/45.png", "/avatar/46.png", "/avatar/47.png", "/avatar/48.png", "/avatar/49.png",
            "/avatar/50.png", "/avatar/51.png", "/avatar/52.png", "/avatar/53.png", "/avatar/54.png", "/avatar/55.png", "/avatar/56.png", "/avatar/57.png", "/avatar/58.png",
            ];
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            image,
        });

        generateTokenAndSetCookie(newUser._id, res)
        await newUser.save();    

        // Remove password from response
        res.status(201).json({sucess: true, user: {
            ...newUser._doc,
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

export async function authCheck(req, res) {
    try{
        console.log("req.user:", req.user);
        res.status(200).json({success:true, user: req.user});
    } catch(error) {
        console.log("Error in authCheck controller function");
        res.status(200).json({success:false, message:"Internal server error"});
    }
}

export async function updateProfile(req, res) {
    try {
        const userId = req.user._id; // Assuming user ID is attached by `protectRoute` middleware
        const { username, email, image } = req.body;

        // Validate input
        if (!username || !email) {
            return res.status(400).json({ success: false, message: "Username and email are required" });
        }

        // Check if the username is already taken by another user
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername && existingUserByUsername._id.toString() !== userId.toString()) {
            return res.status(400).json({ success: false, message: "Username already taken" });
        }

        // Check if the email is already taken by another user
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail && existingUserByEmail._id.toString() !== userId.toString()) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }

        // Update user data
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email, image },
            { new: true, runValidators: true }
        );

        // Return updated user data without the password field
        res.status(200).json({
            success: true,
            user: {
                ...updatedUser._doc,
                password: ""  // Exclude the password field from the response
            }
        });
    } catch (error) {
        console.log("Error in updateProfile controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}