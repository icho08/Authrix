import express from "express"; 
import cors from "cors";  
import dotenv from "dotenv"; 
import bodyParser from "body-parser";

const app = express();
dotenv.config(); 

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

app.listen(3000 , ()=>{ 
    console.log("Server is running at http://localhost:3000"); 
})