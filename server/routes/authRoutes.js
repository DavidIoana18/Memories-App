import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Strategy as LocalStrategy } from 'passport-local';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import {createUser, findUserByEmail, findUserByGoogleId, comparePasswords} from '../models/user.js';
import  {checkToken, tokenBlacklist} from '../middleware/tokenMiddleware.js';

const router = express.Router();

// configure passport to use the local strategy
passport.use("local", new LocalStrategy(
    {usernameField: 'email'},
     async function verify (email, password, done) {
        try{
            const user = await findUserByEmail(email);
            if(user && user.auth_method === 'google'){  // if the user is found but registered with Google
                return done(null, false, {message: 'This email is registred with Google. Please login using Google!'}); 
            }

            if (!user) { // if the user is not found
                return done(null, false, { message: 'No user found with this email!' });
            }

            const storedHashedPassword = user.password;
            const passwordsMatch = await comparePasswords(password, storedHashedPassword);

            if(!passwordsMatch){ // if the passwords don't match
                return done(null, false, {message: 'Incorrect password!'}); 
            }

            return done(null, user); // if the user is found and the passwords match, return the user

        }catch(err){
            console.error("Error verifying user: ", err);
            return done(err); 
        }
    }
));

// configure passport to use the google strategy
passport.use("google", new GoogleStrategy(
    {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    prompt: 'select_account', // force the user to select an account every time
    }, async (accesToken, refreshToken, profile, done) => {
        // console.log(profile);
        try{
            const user = await findUserByGoogleId(profile.id);
            if(user){  // if the user autenticated with Google is found, return the user
                return done(null, user); 
            }

            // if there is no user with a Google ID, check if there is an account with the same email but registered through another method
            const userByEmail = await findUserByEmail(profile.emails[0].value);
            if(userByEmail && userByEmail.auth_method !== 'google'){
                return done(null, false, {message: "This email is already registered. Please login with your email!"});
             }

             // if there is no user with this email, create a new one
            const newUser = {
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                googleId: profile.id,
                authMethod: 'google',
                password: null
            };

            const createdUser = await createUser(newUser);
            return done(null, createdUser);
           
        }catch(err){
            console.error("Error authenticating user with Google: ", err);
            return done(err);
        }
    }
));

// route for registering a new user
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists!' });
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
            res.status(201).json({ message: 'User registered successfully', newUser });   
        }
    } catch (err) {
        console.error("Error registering user: ", err);
        res.status(500).json({ message: 'Server error!' });
    }
});

// route for logging in a user with email and password
router.post('/login',(req, res, next) =>{
    passport.authenticate('local', {session: false}, (err, user, info) =>{
    if(err){ 
        return res.status(500).json({message: 'Server error!'});
    }
    if(!user){
        return res.status(401).json({message: info?.message || 'Authentication failed'});  // ( ?. - optional chaining) info?.message -> if info is null or undefined, return undefined
    }

    const token = jwt.sign(
        {id: user.id, email: user.email},
        process.env.JWT_SECRET,
        {expiresIn: '10m'}
    );
    res.json({message: 'User logged in successfully', user, token});
    })(req, res, next);
}); 

// route that redirects the user to Google to authorize access
router.get('/google', (req, res, next) =>{
    passport.authenticate('google', { 
        scope: ['profile', 'email'],  
        prompt: req.query.prompt || 'none'  // prompt the user to select an account every time
    })(req, res, next);
});

// Google callback after user grants permissions
// Google oauth use GET method so we can't send the error messages in a JSON format, we have to send them as query parameters
router.get('/google/callback', (req, res, next) =>{
    passport.authenticate('google', {session:false, failureRedirect: 'http://localhost:3000/login'}, (err, user, info) =>{
        if(err){
            return res.redirect(`http://localhost:3000/login?error=${encodeURIComponent(err)}`); // encode the error message because it may contain special characters
        }
        
        if(!user){
            return res.redirect(`http://localhost:3000/login?error=${encodeURIComponent(info?.message || 'Authentication failed')}`);
        }
        
        const token = jwt.sign(
            {id: user.id, email: user.email, authMethod: 'google'},
            process.env.JWT_SECRET,
            {expiresIn: '10m'}
        );
        // if the google authentication is successful, redirect the user to the memories page with the token
        res.redirect(`http://localhost:3000/memories?token=${token}`);
        
    })(req, res, next);
});


// route for logging out a user
router.post('/logout', (req, res) => {
    try{
        const authHeader = req.headers.authorization;

        if(authHeader && authHeader.startsWith('Bearer ')){
            const token = authHeader.split(' ')[1];         // get the token from the authorization header that is sent from the client(from navbar.js)
           tokenBlacklist.add(token); // add the token to the blacklist
        }
        res.json({message: 'User logged out successfully'}); 
    }catch(err){
        console.error('Error logging out: ', err);
        res.status(500).json({message: 'Logout failed!'});
    }
});

router.get('/logout/google', (req, res) => {
    console.log('Logging out from Google...');
    res.json({ message: "Google logged out successfully" });
});


export default router;