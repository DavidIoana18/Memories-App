import{createMemoryHandler, getAllMemoriesHandler, getAllMemoriesByUserIdHandler, updateMemoryHandler, deleteMemoryHandler, getExploreMemoriesHandler, getForYouMemoriesHandler} from '../controllers/memoryController.js';
import {
    toggleLikeHandler, getLikesCountHandler, hasUserLikedHandler, getUsersWhoLikedHandler, 
    addCommentHandler, getCommentsHandler, getCommentsCountHandler
} from '../controllers/interactionController.js';
import express from 'express';
import authenticateUser from '../middleware/authenticateUser.js';
const router = express.Router();

// Memory routes
router.post('/', authenticateUser, createMemoryHandler);                  // creates a new memory
router.get('/', authenticateUser, getAllMemoriesHandler);                 // returns the authenticated user's memories
router.get('/user/:id', authenticateUser, getAllMemoriesByUserIdHandler); // returns the memories of another user, by userId
router.put('/:id',authenticateUser,  updateMemoryHandler);                // updates a memory
router.delete('/:id', authenticateUser, deleteMemoryHandler);             // deletes a memory

// Interaction memory routes
router.post('/:memoryId/like', authenticateUser, toggleLikeHandler);      // toggles like button on a memory
router.get('/:memoryId/likes', getLikesCountHandler);                     // returns the number of likes on a memory
router.get('/:memoryId/hasLiked', authenticateUser, hasUserLikedHandler); // checks if the user has liked a memory
router.get('/:memoryId/likes/users', getUsersWhoLikedHandler);            // returns the users who liked a memory

router.post('/:memoryId/comment', authenticateUser, addCommentHandler);   // adds a comment to a memory
router.get('/:memoryId/comments', getCommentsHandler);                    // returns all comments on a memory
router.get('/:memoryId/comments-count', getCommentsCountHandler);         // returns the users who commented on a memory

router.get('/feed/explore', authenticateUser, getExploreMemoriesHandler); // gets memories posted by users the logged-in user doesn’t follow
router.get('/feed/for-you', authenticateUser, getForYouMemoriesHandler);  // gets memories posted by users the logged-in user follows

export default router;