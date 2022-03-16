import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post('/new', async (req:express.Request, res:express.Response) => {
  const { title , description, image, price} = req.body;
  try {
    if(title === "" || description === "" ) {
      res.status(400).json({success: false, message: "Missing data"});
      return
    }
    const post = await prisma.listing.create({
      data: {
        title,
        description,
        price,
        image,
        creator: {
          connect: {
            id: req.session.user.id
          }
        }
      }
    });
    res.status(200).json({success: true, post});
  } catch (e) {
    console.log(e)
    res.status(500).json({success: false, message: "An error has occurred"});
  }
})

router.get('/', async (_, res:express.Response) => {
  try {
    const listings = await prisma.listing.findMany({
      include: {
        creator: true
      }
    });
    res.status(200).json({success: true, listings});
  } catch (e) {
    console.log(e)
    res.status(500).json({success: false, message: "An error has occurred"});
  }
})

router.get('/:id', async (req:express.Request, res:express.Response) => {
  let { id } = req.params;
  try {
    const post = await prisma.listing.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        creator: true
      }
    });
    res.status(200).json({success: true, post});
  } catch (e) {
    console.log(e)
    res.status(500).json({success: false, message: "An error has occurred"});
  }
})

router.put('/:id', async(req: express.Request, res: express.Response) => {
  let { id } = req.params;
  const { title, description, image, price } = req.body;
  try {
    const post = await prisma.listing.findUnique({where: {id: parseInt(id)}, include: {creator: true}});
    if (post) {
      if (post.creator_id === req.session.user.id) {
        const updatedPost = await prisma.listing.update({
          where: {
            id: parseInt(id)
          },
          data: {
            title,
            description,
            image,
            price
          }
        });
        res.status(200).json({success: true, updatedPost});
      } else {
        res.status(401).json({success: false, message: "Unauthorized"});
      }
    } else {
      res.status(404).json({success: false, message: "Post not found"});
    }
    res.status(200).json({success: true, post});
  } catch (e) {
    console.log(e)
    res.status(500).json({success: false, message: "An error has occurred"});
  }
})

//delete a listing
router.delete('/:id', async (req: express.Request, res: express.Response) => {
  let { id } = req.params;
  try {
    const post = await prisma.listing.findUnique({where: {id: parseInt(id)}, include: {creator: true}});
    if (post) {
      if (post.creator_id === req.session.user.id) {
        await prisma.listing.delete({
          where: {
            id: parseInt(id)
          }
        });
        res.status(200).json({success: true, message: "Post deleted"});
      } else {
        res.status(401).json({success: false, message: "Unauthorized"});
      }
    } else {
      res.status(404).json({success: false, message: "Post not found"});
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({success: false, message: "An error has occurred"});
  }
})


module.exports = router;