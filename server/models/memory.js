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

export {createMemory, getAllMemories, updateMemory, deleteMemory};