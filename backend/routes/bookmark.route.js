import express from 'express';
import { 
    addBookmark, 
    removeBookmark, 
    getBookmarks 
} from '../controllers/bookmark.controller.js';

const router = express.Router();

router.post('/add', addBookmark);
router.delete('/remove/:contentId', removeBookmark);
router.get('/', getBookmarks);

export default router;