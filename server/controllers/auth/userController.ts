
import { Request, Response } from 'express';
import { createUser } from '../../models/auth/User';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const applicationId  = req.app.id; 
  
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }
  
  const result = await createUser(email, password, applicationId , !req.app.requireEmailVerification);
  
  if (!result) {
    return res.status(500).json({ error: "Failed to create user" });
  }
  
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  
  res.status(201).json(result);
};
