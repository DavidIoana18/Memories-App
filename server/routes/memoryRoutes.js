import{createMemoryHandler, getAllMemoriesHandler, updateMemoryHandler, deleteMemoryHandler} from '../controllers/memoryController.js';
import express from 'express';
import authenticateUser from '../middleware/authenticateUser.js';
const router = express.Router();

router.post('/', authenticateUser, createMemoryHandler);
router.get('/', authenticateUser, getAllMemoriesHandler);
router.put('/:id',authenticateUser,  updateMemoryHandler);
router.delete('/:id', authenticateUser, deleteMemoryHandler);

export default router;