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
const DATABASE_URL = process.env.DATABASE_URL;


connectdb(DATABASE_URL);
app.use(cors());
// app.use(cors({
//             origin : ["https://dummy-crm-4k41.vercel.app/"],
//             methods : ["GET", "POST", "DELETE", "PUT"],
//             credentials : true
//         }        
//     ));
app.use(express.json({ limit: "30mb" }));

app.use('/auth', auth);
app.use('/user', user);
app.use('/project', project);
app.use('/audio', audio);

app.listen(PORT, ()=>{
    console.log(`server listening at http://localhost:${PORT}`);
})
