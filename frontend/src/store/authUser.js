import {create} from "zustand";
import axios from "axios";
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    user: null,
    isSigningUp: false,
    isCheckingAuth: true, //check if user is authenticated if website refreshed
    isLoggingIn: false,
    isLoggingOut: false,
    signup: async (credentials) => {
        try {
            const response = await axios.post("/api/v1/auth/signup", credentials);
            set({user:response.data.user, isSigningUp: false});
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response.data.message || "An error occured in signup");
            set({isSigningUp: false, user: null});
        }
    },
    login: async (credentials) => {
        set({isLoggingIn: true});
        try{
            const response = await axios.post("api/v1/auth/login", credentials);
            set({user: response.data.user, isLoggingIn: false});
            const username = response.data.user.username;
            toast.success(`Welcome,  ${username}`);
        } catch(error) {
            // console.log(error.message);
            set({isLoggingIn: false, user: null});
            toast.error(error.response.data.message || "An error has occured in login")
        }
    },
    logout: async () => {
        try {
            await axios.post("/api/v1/auth/logout");
            set({user: null, isLoggingOut: false});
            toast.success("Logged out successfully");
        } catch (error) {
            set({isLoggingOut: false});
            toast.error(error.response.data.message || "Logout failed");
        }
    },
    authCheck: async () => {
        set({isCheckingAuth: true})
        try {
            const response = await axios.get("/api/v1/auth/authCheck");
            set({user: response.data.user, isCheckingAuth: false});
        } catch (error) {
            set({isCheckingAuth: false, user:null});
            // we comment this out because when refreshing the page while logging out, you will be seeing
            // toast messages about the token being absent
            // toast.error(error.response.data.message || "An error occured in authCheck");
            console.log(error.message);
        }
    },
    updateUser: async (updatedData) => {
        try {
            const response = await axios.put("/api/v1/auth/update", updatedData);
            set({ user: response.data.user });
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    }    
}));