import db from '../config/database.js';
import bcrypt from 'bcryptjs';

async function createUser(user){
    const {firstName, lastName, email, password, authMethod, googleId} = user;
    try{
        let hashedPassword = null;

        if (authMethod === 'local' && password) {
            hashedPassword = await bcrypt.hash(password, 10); // hash the password
        }

        const result = await db.query(
            `INSERT INTO users (first_name, last_name, email, password, auth_method, google_id) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, 
            [firstName, lastName, email, hashedPassword, authMethod, googleId]
        );

        return result.rows[0];

    }catch(err){
        console.error("Error creating user: ", err);
    }
}

async function findUserByEmail(email){
    try{
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if(result.rows.length){
            return result.rows[0];
        }

        return null;  

    }catch(err){
        console.error("Error finding user by email: ", err);
    }
}

async function findUserById(id){
    try{
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        if(result.rows.length){
            return result.rows[0];
        }

        return null;  
    }catch(err){
        console.error("Error finding user by id: ", err);
    }
}

async function findUserByGoogleId(googleId){
    try{
        const result = await db.query('SELECT * FROM users WHERE google_id = $1', [googleId]);

        if(result.rows.length){
            return result.rows[0];
        }

        return null;
        
    }catch(err){
        console.error("Error finding user by google id: ", err);
    }
}

async function deleteUser(id){
    try{
       await db.query('DELETE FROM users WHERE id = $1', [id]);
    }catch(err){
        console.error("Error deleting user: ", err);
    }
}

async function comparePasswords(password, hashedPassword){
    return await bcrypt.compare(password, hashedPassword);
}

async function getFollowersCount(userId){
    try{
        const result =  await db.query('SELECT COUNT(*) FROM followers WHERE following_id = $1', [userId]);
        return result.rows[0].count;
    }catch(err){
        console.error('Error getting followers count: ', err);
        throw new Error('Error getting followers count');
    }
}

async function getFollowingCount(userId){
    try{
        const result = await db.query('SELECT COUNT(*) FROM followers WHERE follower_id = $1', [userId]);
        return result.rows[0].count;
    }catch(err){
        console.error('Error getting following count: ', err);
        throw new Error('Error getting following count');
    }
}

async function getMemoriesCount(userId){
    try{
        const result = await db.query('SELECT COUNT(*) FROM memories WHERE user_id = $1', [userId]);
        return result.rows[0].count;
    }catch(err){
        console.error('Error getting memories count: ', err);
        throw new Error('Error getting memories count');
    }
}

async function updateUserProfile(userId, {bio, image_url}){
    const fields = [];
    const values = [];
    let index = 1;

    if (bio !== undefined) { // null or string
        fields.push(`bio = $${index++}`);
        values.push(bio); 
    }

    if (image_url !== undefined) {   // null or string
        fields.push(`image_url = $${index++}`);
        values.push(image_url);
    }
    
    if(fields.length === 0) return;

    const query = ` UPDATE users SET ${fields.join(', ')} WHERE id = $${index}`;
    values.push(userId);

    await db.query(query, values);

}
export {createUser, findUserByEmail, findUserByGoogleId, findUserById, comparePasswords, deleteUser, getFollowersCount, getFollowingCount, getMemoriesCount, updateUserProfile};