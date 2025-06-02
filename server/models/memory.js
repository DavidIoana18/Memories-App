import db from '../config/database.js';

async function createMemory(memory){
    try{
        const {userId, title, description, hashtag, imageUrl} = memory;
        
        const result = await db.query(
            `INSERT INTO memories (user_id, title, description, hashtag, image_url) 
            VALUES ($1, $2, $3, $4, $5) RETURNING* `, 
            [userId, title, description, hashtag, imageUrl]
        );
        return result.rows[0];
    }catch(err){
        console.error('Error creating memory: ', err);
    }
}

async function getAllMemories(userId){
    try{
        const result = await db.query(
            `SELECT * FROM memories WHERE user_id = $1 ORDER BY created_at DESC`, 
            [userId]
        );
        return result.rows;
    }catch(err){
        console.error('Error getting memories: ', err);
    }
}

async function updateMemory(memoryId, userId, updatedMemory){
    const {title, description, hashtag, imageUrl} = updatedMemory;

    let fieldsToUpdate = [];
    let values =[];
    
    if(title){
        fieldsToUpdate.push(`title = $${fieldsToUpdate.length + 1}`);
        values.push(title);
    }
    if(description){
        fieldsToUpdate.push(`description = $${fieldsToUpdate.length + 1}`);
        values.push(description);
    }
    if(hashtag){
        fieldsToUpdate.push(`hashtag = $${fieldsToUpdate.length + 1}`);
        values.push(hashtag);
    }
    if(imageUrl){
        fieldsToUpdate.push(`image_url = $${fieldsToUpdate.length + 1}`);
        values.push(imageUrl);
    }

    if(fieldsToUpdate.length === 0){
        console.error('No fields to update!');
        return null;
    }

    values.push(userId, memoryId);

    try{
        const result = await db.query(
            `UPDATE memories 
            SET ${fieldsToUpdate.join(', ')} 
            WHERE id = $${values.length} AND user_id = $${values.length - 1} RETURNING *`,
            values
        );
        return result.rows[0]; // return the updated memory
    }catch(err){
        console.error('Error updating memory: ', err);
    }
}

async function deleteMemory(memoryId, userId){
    try{
        const result = await db.query(
            'DELETE FROM memories WHERE id = $1 AND user_id = $2',
             [memoryId, userId]
        );
        return result.rowCount > 0; // return true if the memory was deleted
    }catch(err){
        console.error('Error deleting memory: ', err);
    }
}

async function getExploreMemories(userId) {
    try {
        const memoriesQuery = `
            SELECT m.id, m.title, m.description, m.hashtag, m.image_url, m.created_at,
                   u.id AS user_id, u.first_name, u.last_name, u.image_url AS user_image,
                   (SELECT COUNT(*) FROM memory_likes WHERE memory_id = m.id) AS like_count,  -- Count the number of likes for the memory
                   (SELECT COUNT(*) FROM memory_comments WHERE memory_id = m.id) AS comment_count, -- Count the number of comments for the memory and alias it as "comment_count"
                   EXISTS ( 
                       SELECT 1 FROM memory_likes WHERE memory_id = m.id AND user_id = $1
                   ) AS has_liked
                    -- Check if the current user (identified by $1) has liked the memory, returning true or false as "has_liked".
            FROM memories m
            JOIN users u ON m.user_id = u.id
            WHERE u.id NOT IN (
                SELECT f.following_id
                FROM followers f
                WHERE f.follower_id = $1
            )
            -- Exclude memories created by users that the current user (identified by $1) is following
            AND u.id != $1
            -- Exclude memories created by the current user themselves.
            ORDER BY m.created_at DESC
        `;
        const result = await db.query(memoriesQuery, [userId]);
        return result.rows;
    } catch (err) {
        console.error('Error getting explore memories: ', err);
        throw new Error('Error getting explore memories');
    }
}

async function getForYouMemories(userId) {
    try {
        const memoriesQuery = `
            SELECT m.id, m.title, m.description, m.hashtag, m.image_url, m.created_at,
                   u.id AS user_id, u.first_name, u.last_name, u.image_url AS user_image,
                   (SELECT COUNT(*) FROM memory_likes WHERE memory_id = m.id) AS like_count,
                   (SELECT COUNT(*) FROM memory_comments WHERE memory_id = m.id) AS comment_count,
                   EXISTS (
                       SELECT 1 FROM memory_likes WHERE memory_id = m.id AND user_id = $1
                   ) AS has_liked
            FROM memories m
            JOIN users u ON m.user_id = u.id
            JOIN followers f ON f.following_id = m.user_id
            WHERE f.follower_id = $1
            ORDER BY m.created_at DESC
        `;
        const result = await db.query(memoriesQuery, [userId]);
        return result.rows;
    } catch (err) {
        console.error('Error getting for you memories: ', err);
        throw new Error('Error getting for you memories');
    }
}

export {createMemory, getAllMemories, updateMemory, deleteMemory, getExploreMemories, getForYouMemories};