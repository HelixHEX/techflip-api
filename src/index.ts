import "dotenv-safe/config";
import "reflect-metadata";

import express from "express";

import morgan from "morgan";

const cors = require("cors");

const posts = require('./routes/posts')
const listings = require('./routes/listings')

const main = () => {
  const app = express();

 // @ts-ignore
 morgan.token('body', (req, res) => JSON.stringify(req.body));
 app.use(morgan(":remote-user [:date[clf]] ':method :status :url HTTP/:http-version' :body ':user-agent' - :response-time ms"));

  app.use(cors({ origin: ['http://localhost:3000'] }));

  app.use(express.json());

  //routes 
  app.get("/", (_, res: express.Response) => {
    res.send("Hello world");
  });

  app.use('/api/v1/posts', posts)
  app.use('/api/v1/listings', listings)

  app.use((_, res: express.Response) => {
    res.status(404).json({ status: "404" });
  });

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`);
  });
};

main();
