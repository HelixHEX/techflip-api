import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

//create new post 
router.post('/new', async(req: express.Request, res: express.Response) => {
  const {title, content} = req.body 
  try {
    if(title === "" || content === "") {
      res.status(400).json({success: false, message: "Missing data"});
    }
    const post = await prisma.post.create({
      data: {
        title,
        content,
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

//get all posts
router.get('/', async(_, res: express.Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        creator: {select: {name: true, email: true, id: true}}
      }
    });
    res.status(200).json({success: true, posts});
  } catch (e) {
    console.log(e)
    res.status(500).json({success: false, message: "An error has occurred"});
  }
})

//get post by id
router.get('/:id', async(req: express.Request, res: express.Response) => {
  let { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        creator: {select: {name: true, email: true, id: true}}
       }
    });
    res.status(200).json({success: true, post});
  } catch (e) {
    console.log(e)
    res.status(500).json({success: false, message: "An error has occurred"});
  }
})

//update post
router.put('/:id', async(req: express.Request, res: express.Response) => {
  let { id } = req.params;
  const {title, content} = req.body
  try {
    if(title === "" || content === "") {
      res.status(400).json({success: false, message: "Missing data"});
    }
    const post = await prisma.post.update({
      where: {
        id: parseInt(id)
      },
      data: {
        title,
        content
      }
    });
    res.status(200).json({success: true, post});
  } catch (e) {
    console.log(e)
    res.status(500).json({success: false, message: "An error has occurred"});
  }
})

//delete post
router.delete('/:id', async(req: express.Request, res: express.Response) => {
  let { id } = req.params;
  try {
    const post = await prisma.post.findUnique({where: {id: parseInt(id)}, include: {creator: true}});
    if (!post) {
      res.status(404).json({success: false, message: "Post not found"});
    } else if (post.creator_id !== req.session.user.id) {
      res.status(401).json({success: false, message: "Unauthorized"});
    } else {
      await prisma.post.delete({
        where: {
          id: parseInt(id)
        }
      });
      res.status(200).json({success: true});
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({success: false, message: "An error has occurred"});
  }
})

//get all posts by user
router.get('/user/:id', async(req: express.Request, res: express.Response) => {
  let { id } = req.params;
  try {
    const posts = await prisma.post.findMany({
      where: {
        creator_id: id
      },
      include: {
        creator: {select: {name: true, email: true, id: true}}
      }
    });
    res.status(200).json({success: true, posts});
  } catch (e) {
    console.log(e)
    res.status(500).json({success: false, message: "An error has occurred"});
  }
})

//create comment
router.post('/comment/:id', async(req: express.Request, res: express.Response) => {
  let { id } = req.params;
  const {content} = req.body
  try {
    if(content === "") {
      res.status(400).json({success: false, message: "Missing data"});
    }
    const post = await prisma.post.findUnique({where: {id: parseInt(id)}, include: {creator: true}});
    if (!post) {
      res.status(404).json({success: false, message: "Post not found"});
    } else {
      const comment = await prisma.comment.create({
        data: {
          content,
          post: {
            connect: {
              id: parseInt(id)
            }
          },
          creator: {
            connect: {
              id: req.session.user.id
            }
          }
        }
      });
      res.status(200).json({success: true, comment});
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({success: false, message: "An error has occurred"});
  }
})

module.exports = router;