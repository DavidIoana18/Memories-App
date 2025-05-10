import { findUserById, getFollowersCount, getFollowingCount, getMemoriesCount, updateUserProfile } from '../models/user.js';

async function getUserByIdHandler(req, res){
    const userId = req.params.id;
    try{
        const user = await findUserById(userId);
        if(!user){
            return res.status(404).json({message: 'User not found!'});
        }

        const followersCount = await getFollowersCount(userId);
        const followingCount = await getFollowingCount(userId);
        const memoriesCount = await getMemoriesCount(userId);

        res.status(200).json({
            message: 'User fetched successfully!',
             user:{
                ...user,
                followersCount,
                followingCount,
                memoriesCount
             }
        });
    }catch(err){
        console.error('Error getting user: ', err);
        res.status(500).json({message: err.message});
    }
}

async function updateUserProfileHandler(req, res){
    const userId = req.user.id;
    const updates = {};
   
    try{
        if ('bio' in req.body) updates.bio = req.body.bio;
        if ('image_url' in req.body) updates.image_url = req.body.image_url;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'Nothing changed' });
        }

        await updateUserProfile(userId, updates);
        
        res.status(200).json({message: 'Profile updated successfully!'});
    }catch(err){
        console.error('Error updating user profile: ', err);
        res.status(500).json({message: err.message});
    }
}

export {getUserByIdHandler, updateUserProfileHandler};