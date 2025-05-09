import db from '../config/database.js';

async function toggleLike(userId, memoryId){
    try{
        const result = await db.query(
            'SELECT * FROM memory_likes WHERE user_id = $1 AND memory_id = $2',
            [userId, memoryId]
        );

        if (result.rows.length> 0){ // if the user already liked the memory
            await db.query(
                'DELETE FROM memory_likes WHERE user_id = $1 AND memory_id = $2',
                [userId, memoryId]
            );
            return {liked: false};

        }else{ // if the user has not liked the memory yet, add the like
            await db.query(
                'INSERT INTO memory_likes (user_id, memory_id) VALUES ($1, $2)',
                [userId, memoryId]
            );
            return {liked: true};
        }
    }catch(err){
        console.error("Error toggling like: ", err);
        throw new Error('Error toggling like');
    }
}

async function getLikesCount(memoryId){
    try{
        const result = await db.query(
            'SELECT COUNT(*) FROM memory_likes WHERE memory_id = $1',
            [memoryId]
        );
        return result.rows[0].count;
    }catch(err){
        console.error('Error getting likes count: ', err);
        throw new Error('Error getting likes count');
    }
}

async function hasUserLiked(userId, memoryId){
    try{
        // Check if the user has liked the memory and return true or false
        // use SELECT 1 because we don't need the actual data, just a boolean
        const result = await db.query( 
            'SELECT 1 FROM memory_likes WHERE user_id = $1 AND memory_id = $2', 
            [userId, memoryId]
        );
        return result.rows.length > 0;
    }catch(err){
        console.error('Error checking if user liked memory: ', err);
        throw new Error('Error checking if user liked memory');
    }
}

async function getUsersWhoLiked(memoryId){
    try{
        const result = await db.query(
            `SELECT u.id, u.first_name, u.last_name, u.image_url
             FROM memory_likes ml 
             JOIN users u ON ml.user_id = u.id
             WHERE ml.memory_id = $1`,
             [memoryId]
        );
        return result.rows;
    }catch(err){
        console.error('Error getting users who liked memory: ', err);
        throw new Error('Error getting users who liked memory');
    }
}

export { toggleLike, getLikesCount, hasUserLiked, getUsersWhoLiked };