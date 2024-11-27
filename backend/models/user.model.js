import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "",
    },
    searchHistory: {
        type: Array,
        default: [],
    },
    bookmarks: [{
        contentId: {
            type: String,
            required: true
        },
        contentType: {
            type: String,
            required: true,
            enum: ['movie', 'tv']
        },
        addedAt: {
            type: Date,
            default: Date.now
        },
        title: {
            type: String,
            required: true
        },
        posterPath: {
            type: String
        }
    }]
});

export const User = mongoose.model('User', userSchema);