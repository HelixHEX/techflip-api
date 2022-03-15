import express from "express";

const router = express.Router();

router.post('/', (req, res) => {
  res.send('Hello world');
})
module.exports = router;