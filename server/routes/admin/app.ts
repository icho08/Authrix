import express from "express";
import { createApp } from "../../controllers/admin/appController";

const router = express.Router(); 

router.post("/apps", createApp); 

export default router; 
