import express from "express"; 
import cors from "cors";  
import dotenv from "dotenv"; 
import bodyParser from "body-parser";
import { logger } from "./config/logger";
import admin from "./routes/admin/app";
import auth from "./routes/auth/user";
import { generalLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import { requestId } from "./middleware/requestId";

const app = express();
dotenv.config(); 

app.set('trust proxy', process.env.NODE_ENV === 'production');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    if (origin.match(/^http:\/\/localhost:\d+$/)) {
      return callback(null, true);
    }
    
    const allowedDomains = [
      "https://authrix.chhabi.xyz",
      "https://api.authrix.chhabi.xyz"
    ];
    
    if (allowedDomains.includes(origin)) {
      return callback(null, true);
    }
    
    if (origin.startsWith('https://')) {
      return callback(null, true);
    }
   callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-API-Key", "X-Requested-With", "X-Refresh-Token"]
}));

app.use(requestId);
app.use(generalLimiter);
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true})); 

app.get("/health" , (req , res)=> { 
    res.status(200).json({status: "ok"}); 
}); 

app.use('/api/admin/', admin); 
app.use('/api/auth/', auth); 

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT , ()=>{ 
    logger.info(`Server is running on port ${PORT}`); 
})

export default app;