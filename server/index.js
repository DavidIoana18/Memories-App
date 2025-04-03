import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import authRoutes from './routes/authRoutes.js';
import './middleware/passport.js';
import memoryRoutes from './routes/memoryRoutes.js';

dotenv.config(); // load environment variables from a .env file into process.env

const app = express();
const port = process.env.PORT;

// Middlewares
app.use(express.json());                             // parse incoming request bodies in a middleware before your handlers, available under the req.body property
app.use(cors({ origin: "http://localhost:3000" }));  // allow requests from the React app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize()); // initialize the passport middleware

app.use('/auth', authRoutes);
app.use('/memories', memoryRoutes);

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})

