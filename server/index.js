import express from "express";
import cors from "cors";
import connectdb from "./db/connectdb.js";
import auth from "./routes/auth.js";
import project from "./routes/project.js";
import audio from "./routes/audio.js";
import user from  "./routes/user.js";


const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL || "mongodb+srv://shivam0076:shivam0076@shivam.klepebz.mongodb.net/crm?retryWrites=true&w=majority";
connectdb(DATABASE_URL);


app.use(cors({
            origin : ["https://crm-client-navy.vercel.app/"],
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
