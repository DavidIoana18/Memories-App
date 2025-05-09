import express from 'express';
import authenticateUser from '../middleware/authenticateUser.js';
import {getUserByIdHandler, updateUserProfileHandler} from '../controllers/userController.js';

const router = express.Router();

router.get('/:id', getUserByIdHandler);
router.put('/update-profile', authenticateUser, updateUserProfileHandler); // updates the user's profile(bio or image profile)

export default router;