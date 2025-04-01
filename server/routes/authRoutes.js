import express from 'express';
import {
    registerUser,
    loginUser,
    googleAuth,
    googleCallback,
    logoutUser,
    logoutGoogle
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.post('/logout', logoutUser);
router.get('/logout/google', logoutGoogle);

export default router;