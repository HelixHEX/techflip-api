import express from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router();

router.post("/login", async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;
  try {
    if (email === "" || password === "") {
      res.status(400).json({success: false, message: "Invalid email or password"});
    } else {
      const user = await prisma.user.findUnique({where: {email}})
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;
