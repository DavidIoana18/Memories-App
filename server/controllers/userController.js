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
    const {bio, image_url} = req.body;

    if(!bio && !image_url){
        return res.status(400).json({message: 'No fields to update!'});
    }

    try{
        await updateUserProfile(userId, {bio, image_url});
        res.status(200).json({message: 'Profile updated successfully!'});
    }catch(err){
        console.error('Error updating user profile: ', err);
        res.status(500).json({message: err.message});
    }
}

export {getUserByIdHandler, updateUserProfileHandler};