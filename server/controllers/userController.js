import { 
    findUserById, getFollowersCount, getFollowingCount, getFollowingList, getFollowersList, toggleFollow,
    getMemoriesCount, updateUserProfile, deleteUser, checkIfUserFollows 
} from '../models/user.js';

async function getUserByIdHandler(req, res){
    const userId = parseInt(req.params.id);
    const currentUserId = req.user?.id; // logged in user id(could be undefined if not logged in) 
    
    try{
        const user = await findUserById(userId);
        if(!user){
            return res.status(404).json({message: 'User not found!'});
        }

        const followersCount = await getFollowersCount(userId);
        const followingCount = await getFollowingCount(userId);
        const memoriesCount = await getMemoriesCount(userId);

        const isFollowedByCurrentUser = currentUserId
        ? await checkIfUserFollows(currentUserId, userId)
        : false;

        res.status(200).json({
            message: 'User fetched successfully!',
             user:{
                ...user,
                followersCount,
                followingCount,
                memoriesCount,
                is_followed_by_current_user: isFollowedByCurrentUser
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

async function deleteUserHandler(req, res) {
    const userId = req.user.id;
    try {
        await deleteUser(userId);
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting account' });
    }
}

async function getFollowingListHandler(req, res){
    const currentUserId = req.user.id; // logged in user id
    const userId = req.params.id; // user id from params

    try{
        const followingList = await getFollowingList(userId, currentUserId);
        res.status(200).json({message: 'Following list fetched successfully!', followingList});
    }catch(err){
        console.error('Error getting following list: ', err);
        res.status(500).json({message: err.message});
    }
}

async function getFollowersListHandler(req, res){
    const currentUserId = req.user.id; // logged in user id
    const userId = req.params.id; // user id from params

    try{
        const followersList = await getFollowersList(userId, currentUserId);
        res.status(200).json({message: 'Followers list fetched successfully!', followersList});
    }catch(err){
        console.error('Error getting followers list: ', err);
        res.status(500).json({message: err.message});
    }
}

async function toggleFollowHandler(req, res) {
    const userId = req.user.id;
    const targetUserId = parseInt(req.params.targetUserId);

    if (userId === targetUserId) {
        return res.status(400).json({ message: "You can't follow yourself." });
    }

    try {
        const result = await toggleFollow(userId, targetUserId);
        res.status(200).json({
        message: result.followed
            ? 'Successfully followed user.'
            : 'Successfully unfollowed user.',
        followed: result.followed,
        });
    } catch (err) {
        console.error('Error toggling follow:', err);
        res.status(500).json({ message: err.message });
    }
}


export {getUserByIdHandler, updateUserProfileHandler, deleteUserHandler, getFollowingListHandler, getFollowersListHandler, toggleFollowHandler};