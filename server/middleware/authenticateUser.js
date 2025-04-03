import jwt from 'jsonwebtoken';

function authenticateUser(req, res, next){
    try{
        const authHeader = req.headers.authorization; // exract the authorization header from the request( looks like this -> Authorization: Bearer <token>)

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided. Please log in.' });
        }

        const token = authHeader.split(' ')[1]; // ["Bearer", "<token>"] -> extract the token from the header
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify if the token was signed with the correct secret and if it's expired
        req.user = decoded; // if the verification is successful, save the decoded token in the request object
        
        const expirationTime = new Date(decoded.exp * 1000).toLocaleString();
        console.log(`Valid token. Expires on: ${expirationTime}`);

        next(); // call the next middleware
    }catch(err){ // if the token is invalid or expired throw an error
        console.error('Token verification failed:', err);
       
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired. Please log in again.' });
        }
        
        return res.status(401).json({message:'Invalid token. Please log in again.'});
    }
}
export default authenticateUser;