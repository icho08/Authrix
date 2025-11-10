import { Request, Response, NextFunction } from 'express';

export const requestId = (req: Request, res: Response, next: NextFunction) => {
  const reqId = req.headers['x-request-id'] as string || Math.random().toString(36).substring(7);
  
  (req as any).requestId = reqId;
  
  res.setHeader('X-Request-ID', reqId);
  
  next();
};
