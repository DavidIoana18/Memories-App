import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import {createUser, findUserByEmail, findUserByGoogleId, comparePasswords} from '../models/user.js';

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