import express from "express"; 
import cors from "cors";  
import dotenv from "dotenv"; 
import bodyParser from "body-parser";
import { logger } from "./config/logger";
import admin from "./routes/admin/app";
import auth from "./routes/auth/user";
const app = express();
dotenv.config(); 

app.set('trust proxy', true);

app.use(cors({
origin: process.env.NODE_ENV == "development" ? "*" : String(process.env.CLIENT_URL),
credentials: true , 
methods : ["GET" , "POST" , "PUT" , "PATCH" , "DELETE"]  , 
}));

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true})); 

app.get("/health" , (req , res)=> { 
    res.status(200).json({status: "ok"}); 
}); 
app.use('/api/admin/', admin); 
app.use('/api/auth/', auth); 
app.listen(3000 , ()=>{ 
    logger.info("Server is running at http://localhost:3000"); 
})