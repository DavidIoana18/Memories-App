import passport from 'passport';
import jwt from 'jsonwebtoken';
import {createUser, findUserByEmail} from '../models/user.js';

// register a user with email and password
async function registerUser(req, res) {
    const { firstName, lastName, email, password } = req.body;
    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ field: 'email', message: 'User with this email already exists!' });
        }else{
            const user = {
                firstName,
                lastName,
                email,
                password,
                authMethod: 'local',
                googleId: null            
            };
            const newUser = await createUser(user);
            res.status(201).json({ message: 'User registered successfully!', newUser });   
        }
    } catch (err) {
        console.error("Error registering user: ", err);
        res.status(500).json({message: 'Server error!' });
    }
}

// logging in a user with email and password
async function loginUser(req, res, next){
    passport.authenticate('local', {session: false}, (err, user, info) =>{
        if(err){ 
            console.error("Error during authentication:", err);
            return res.status(500).json({ message: 'Server error!'});
        }
        if(!user){
            return res.status(401).json({ 
                field: info?.field || 'general',
                message: info?.message || 'Authentication failed!'
            });  // ( ?. - optional chaining) info?.message -> if info is null or undefined, return undefined
        }
        // console.error('User logged in: ', user);

        const token = jwt.sign(
            {id: user.id},
            process.env.JWT_SECRET,
            {expiresIn: '1m'}
        );
        res.json({message: 'User logged in successfully!', user, token});
    })(req, res, next);
}

// redirects the user to Google to authorize access
async function googleAuth(req, res, next){
    passport.authenticate('google', { 
        scope: ['profile', 'email'],  
        prompt: req.query.prompt || 'none'  // prompt the user to select an account every time
    })(req, res, next);
}

// Google callback after user grants permissions
// Google oauth use GET method so we can't send the error messages in a JSON format, we have to send them as query parameters
async function googleCallback(req, res, next) {
    passport.authenticate('google', {session:false, failureRedirect: 'http://localhost:3000/auth/register'}, (err, user, info) =>{
        if(err){
            return res.redirect(`http://localhost:3000/auth/register?error=${encodeURIComponent(err)}`); // encode the error message because it may contain special characters
        }
        
        if(!user){
            return res.redirect(`http://localhost:3000/auth/register?error=${encodeURIComponent(info?.message || 'Authentication failed')}`);
        }
        
        const token = jwt.sign(
            {id: user.id, authMethod: 'google'},
            process.env.JWT_SECRET,
            {expiresIn: '2m'}
        );
        // if the google authentication is successful, redirect the user to the memories page with the token
        res.redirect(`http://localhost:3000/memories?token=${token}`);
        
    })(req, res, next);
}

// logging out a user
async function logoutUser(req, res){
   console.log('Logging out...');
    res.json({message: 'User logged out successfully!'});  
}

// logging out a user from Google
async function logoutGoogle(req, res) {
    console.log('Logging out from Google...');
    res.json({ message: "Google logged out successfully" });
};

export {registerUser, loginUser, googleAuth, googleCallback, logoutUser, logoutGoogle};