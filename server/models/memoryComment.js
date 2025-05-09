import db from '../config/database.js';

async function addComment(userId, memoryId, content){
    try{
        const result = await db.query(
            'INSERT INTO memory_comments (user_id, memory_id, content) VALUES ($1, $2, $3) RETURNING *',
            [userId, memoryId, content]
        );
        return result.rows[0];
    }catch(err){
        console.error('Error adding comment: ', err);
        throw new Error('Error adding comment');
    }
}

async function getComments(memoryId){
    const result = await db.query(
        `SELECT mc.id, mc.content, mc.created_at,
                 u.id AS user_id, u.first_name, u.last_name, u.image_url
         FROM memory_comments mc 
         JOIN users u ON mc.user_id = u.id 
         WHERE memory_id = $1 
         ORDER BY mc.created_at DESC`,
        [memoryId]
    );
    return result.rows;
}

export {addComment, getComments};