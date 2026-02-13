import express from "express"; 
import dotenv from "dotenv"; 
import bodyParser from "body-parser";
import { logger } from "./config/logger.js";
import admin from "./routes/admin/app.js";
import auth from "./routes/auth/user.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestId } from "./middleware/requestId.js";
import { dynamicCors } from "./middleware/dynamicCors.js";

const app = express();
dotenv.config(); 

app.set('trust proxy', process.env.NODE_ENV === 'production');

app.use(dynamicCors);

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