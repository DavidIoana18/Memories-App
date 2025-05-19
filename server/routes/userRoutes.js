import express from 'express';
import authenticateUser from '../middleware/authenticateUser.js';
import {getUserByIdHandler, updateUserProfileHandler, deleteUserHandler, getFollowersListHandler, getFollowingListHandler, toggleFollowHandler} from '../controllers/userController.js';

const router = express.Router();

router.get('/:id', authenticateUser, getUserByIdHandler);
router.put('/update-profile', authenticateUser, updateUserProfileHandler); // updates the user's profile(bio or image profile)
router.delete('/delete-account', authenticateUser, deleteUserHandler); // deletes the user's account
router.get('/:id/followers', authenticateUser, getFollowersListHandler); // gets the list of followers of the user
router.get('/:id/following', authenticateUser, getFollowingListHandler); // gets the list of users the user is following
router.post('/toggle-follow/:targetUserId', authenticateUser, toggleFollowHandler); // toggles the follow status of the user

export default router;