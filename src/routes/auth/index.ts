import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const router = express.Router();

const saltRounds = 10;

router.get('/current-session', async(req: express.Request, res: express.Response) => {
  console.log(req.session.user)
  const user = req.session?.user;
  if(!user) {
    res.status(401).send({success: false, message: 'Unauthorized'});
    return
  }
  let {password, createdAt, updatedAt, ...other} = user
  other = {...other, sessionId: req.sessionID}
  res.status(200).json({success: true, user: other});
})

router.post("/login", async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;
  try {
    if (email === "" || password === "" || !email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Incorrect email or password" });
    } else {

      let user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        console.log('hi')
        let checkPass = await bcrypt.compare(password, user.password);
        if (checkPass) {
          let {password, ...other} = user
          req.session!.user = other;
          res.status(200).json({ success: true, user: other});
        } else {
          res
            .status(40)
            .json({ success: false, message: "Incorrect email or password" });
        }
      } else {
        res
        .status(400)
        .json({ success: false, message: "Incorrect email or password" });
      }
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({ success: false, message: "An error has occurred" });
  }
});

router.post("/signup", async (req: express.Request, res: express.Response) => {
  const { name, email, password } = req.body;
  try {
    if (name === "" || email === "" || password === "") {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    } else {
      const exists = await prisma.user.findUnique({ where: { email } });
      if (!exists) {
        bcrypt.hash(password, saltRounds, async (_, hash) => {
          let hashPwd = hash;
          const user = await prisma.user.create({
            data: { name, email, password: hashPwd },
          });
          if (user) {
            req.session!.user = user;
            res.json({ success: true, sessionId: req.sessionID });
          } else {
            res.json({ success: false, message: "An error has occurred" });
          }
        });
      } else {
        res.json({ success: false, message: "Email already in use" });
      }
    }
  } catch (e) {
    res.status(500).send({ success: false, message: e.message });
  }
});

router.post("/logout", (req: express.Request, res: express.Response) => {
  try {
    req.session!.destroy((err) => {
      if (err) {
        res.status(500).json({ success: false, message: "Unable to logout" });
      } else {
        res.json({ success: true });
      }
    });
  } catch (e) {
    res.status(500).send({ success: false, message: e.message });
  }
});

module.exports = router;
