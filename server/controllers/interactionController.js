import {toggleLike, getLikesCount, hasUserLiked, getUsersWhoLiked} from '../models/memoryLike.js';
import {addComment, getComments, getCommentsCount} from '../models/memoryComment.js';

async function toggleLikeHandler(req, res){
    const userId = req.user.id; // get the userId from passport
    const {memoryId} = req.params;
    try{
        const result = await toggleLike(userId, memoryId);
        res.status(200).json({message: result.liked ? 'Like added' : 'Like removed', liked: result.liked});
    }catch(err){
        console.error('Error toggling like: ', err);
        res.status(500).json({message: err.message});
    }
}

async function getLikesCountHandler(req, res){
    const {memoryId} = req.params;
    try{
        const likes = await getLikesCount(memoryId);
        res.status(200).json({message: 'Likes count fetched successfully!', likes});
    }catch(err){
        console.error('Error getting likes count: ', err);
        res.status(500).json({message: err.message});
    }
}

async function hasUserLikedHandler(req, res){
    const userId = req.user.id;
    const {memoryId} = req.params;
    try{
        const hasLiked = await hasUserLiked(userId, memoryId);
        res.status(200).json({message: hasLiked ? 'User has liked this memory' : 'User has not liked this memory', hasLiked});
    }catch(err){
        console.error('Error checking if user liked memory: ', err);
        res.status(500).json({message: err.message});
    }
}

async function getUsersWhoLikedHandler(req, res){
    const {memoryId} = req.params;
    try{
        const users = await getUsersWhoLiked(memoryId);
        res.status(200).json({message: 'Users who liked this memory fetched successfully!', users});
    }catch(err){
        console.error('Error getting users who liked memory: ', err);
        res.status(500).json({message: err.message});
    }
}

async function getUsersWhoCommentedHandler(req, res){
    const {memoryId} = req.params;
    try{
        const users = await getUsersWhoCommented(memoryId);
        res.status(200).json({message: 'Users who commented on this memory fetched successfully!', users});
    }catch(err){
        console.error('Error getting users who commented on memory: ', err);
        res.status(500).json({message: err.message});
    }
}

async function addCommentHandler(req, res){
    const {content} = req.body;
    const {memoryId} = req.params;
    const userId = req.user.id;

    try{
        const comment = await addComment(userId, memoryId, content);
        res.status(200).json({message: 'Comment added successfully!', comment});
    }catch(err){
        console.error('Error adding comment: ', err);
        res.status(500).json({message: err.message});
    }
}

async function getCommentsHandler(req, res){
    const {memoryId} = req.params;

    try{
        const comments = await getComments(memoryId);
        res.status(200).json({message: 'Comments fetched successfully!', comments});
    }catch(err){
        console.error('Error getting comments: ', err);
        res.status(500).json({message: err.message});
    }
}

async function getCommentsCountHandler(req, res){
    const {memoryId} = req.params;

    try{
        const count = await getCommentsCount(memoryId);
        res.status(200).json({message: 'Comments count fetched successfully!', count});
    }catch(err){
        console.error('Error getting comments count: ', err);
        res.status(500).json({message: err.message});
    }
}

export {toggleLikeHandler, getLikesCountHandler, hasUserLikedHandler, getUsersWhoLikedHandler, addCommentHandler, getCommentsHandler, getUsersWhoCommentedHandler, getCommentsCountHandler};