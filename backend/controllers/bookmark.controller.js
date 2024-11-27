import { User } from '../models/user.model.js';

export const addBookmark = async (req, res) => {
    try {
        const { contentId, contentType, title, posterPath } = req.body;
        const userId = req.user.id; // Assuming you have authentication middleware

        // Find the user
        const user = await User.findById(userId);

        // Check if bookmark already exists
        const existingBookmark = user.bookmarks.find(
            bookmark => bookmark.contentId === contentId && bookmark.contentType === contentType
        );

        if (existingBookmark) {
            return res.status(400).json({ message: 'Bookmark already exists' });
        }

        // Add new bookmark
        user.bookmarks.push({
            contentId,
            contentType,
            title,
            posterPath
        });

        await user.save();

        res.status(201).json({ 
            message: 'Bookmark added successfully',
            bookmarks: user.bookmarks 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding bookmark', error: error.message });
    }
};

export const removeBookmark = async (req, res) => {
    try {
        const { contentId } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);

        user.bookmarks = user.bookmarks.filter(
            bookmark => bookmark.contentId !== contentId
        );

        await user.save();

        res.status(200).json({ 
            message: 'Bookmark removed successfully',
            bookmarks: user.bookmarks 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error removing bookmark', error: error.message });
    }
};

export const getBookmarks = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('bookmarks');

        res.status(200).json({ bookmarks: user.bookmarks });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookmarks', error: error.message });
    }
};