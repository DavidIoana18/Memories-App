import {createMemory, getAllMemories, updateMemory, deleteMemory} from '../models/memory.js';

async function createMemoryHandler(req, res){
    const {title, description, hashtag, imageUrl} = req.body;
    const userId = req.user.id;
    try{
        const createdMemory = {userId, title, description, hashtag, imageUrl};
        const memory = await createMemory(createdMemory);
        res.status(201).json({message: "Memory created successfully!", memory});
    }catch(err){
        console.error('Error creating memory: ', err);
        res.status(500).json({message: err.message});
    }
}

async function getAllMemoriesHandler(req, res){
    const userId = req.user.id;
    try{
        const memories = await getAllMemories(userId);
        res.status(200).json({message: 'Memories fetched successfully!', memories});
    }catch(err){
        console.error('Error getting memories: ', err);
        res.status(500).json({message: err.message});
    }
}

async function updateMemoryHandler(req, res){
    const memoryId = req.params.id;
    const userId = req.user.id;
    const {title, description, hashtag, imageUrl} = req.body;

    try{
        const createdMemory = {title, description, hashtag, imageUrl};
        const memory = await updateMemory(memoryId, userId, createdMemory);
        
        if(!updateMemory){
            return res.status(403).json({message: 'You are not authorized to update this memory!'});
        }

        res.status(200).json({message: 'Memory updated successfully!', memory});
    }catch(err){
        console.error('Error updating memory: ', err);
        res.status(500).json({message: err.message});
    }
}

async function deleteMemoryHandler(req, res){
    const memoryId = req.params.id;
    const userId = req.user.id;
    try{
        const deleted = await deleteMemory(memoryId, userId);

        if(!deleted){
            return res.status(403).json({message: 'You are not authorized to delete this memory!'});
        }

        res.status(200).json({message: 'Memory deleted successfully!'});
    }catch(err){
        console.error('Error deleting memory: ', err);
        res.status(500).json({message: err.message});
    }
}

export {createMemoryHandler, getAllMemoriesHandler, updateMemoryHandler, deleteMemoryHandler};