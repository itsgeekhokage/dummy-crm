// require("dotenv").config();
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectdb from "./db/connectdb.js";
import auth from "./routes/auth.js";
import project from "./routes/project.js";
import audio from "./routes/audio.js";
import user from  "./routes/user.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
// const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_URL = "mongodb+srv://abhisheksingh:Mon$ter25452@cluster0.vnlxnb7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


connectdb(DATABASE_URL);
// app.use(cors());
app.use(cors({
             origin : ["https://main.d2j3su6c5okp5n.amplifyapp.com"],
             methods : ["GET", "POST", "DELETE", "PUT"],
             credentials : true
         }        
     ));
app.use(express.json());

app.use('/auth', auth);
app.use('/user', user);
app.use('/project', project);
app.use('/audio', audio);

app.listen(PORT, ()=>{
    console.log(`server listening at http://localhost:${PORT}`);
})
