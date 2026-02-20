import { Request, Response } from "express";
import prisma from "../../config/prisma.js";
import { logger } from "../../config/logger.js";
import bcrypt from "bcryptjs";
import { signStaffToken } from "../../utils/jwt.js";

export const staffLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const staff = await prisma.staff.findUnique({
      where: { email },
    });

    if (!staff || !(await bcrypt.compare(password, staff.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = await signStaffToken({ userId: staff.id, role: staff.role });

    res.status(200).json({
      token,
      staff: {
        id: staff.id,
        username: staff.username,
        email: staff.email,
        role: staff.role,
      },
    });
  } catch (error) {
    logger.error("Staff login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// One-time initialization for the first admin
export const initFirstStaff = async (req: Request, res: Response) => {
  try {
    const staffCount = await prisma.staff.count();
    
    if (staffCount > 0) {
      return res.status(403).json({ error: "Staff already initialized" });
    }

    if (!req.body) {
      return res.status(400).json({ error: "Request body is required" });
    }

    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields: username, email, password" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const firstStaff = await prisma.staff.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    res.status(201).json({ message: "First admin created successfully", id: firstStaff.id });
  } catch (error) {
    logger.error("Staff init error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
