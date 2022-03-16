import "dotenv-safe/config";
import "reflect-metadata";

import express from "express";
import morgan from "morgan";

const session = require("express-session");
const connectRedis = require("connect-redis");
const redis = require("redis");

const cors = require("cors");

const auth = require("./routes/auth");
const posts = require("./routes/posts");
const listings = require("./routes/listings");

const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

const main = () => {
  const app = express();

  // @ts-ignore
  morgan.token("body", (req, res) => JSON.stringify(req.body));
  app.use(
    morgan(
      ":remote-user [:date[clf]] ':method :status :url HTTP/:http-version' :body ':user-agent' - :response-time ms"
    )
  );
  //   var corsOptions = {
  //     origin: '*',
  //     credentials: true };

  // app.use(cors(corsOptions));
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));


  app.use(express.json());

  //redis
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // if true: only transmit cookie over https, in prod, always activate this
        httpOnly: true, // if true: prevents client side JS from reading the cookie
        maxAge: 1000 * 60 * 30, // session max age in milliseconds
        // explicitly set cookie to lax
        // to make sure that all cookies accept it
        // you should never use none anyway
        sameSite: "lax",
      },
    })
  );

  //routes
  app.get("/", (_, res: express.Response) => {
    res.send("Hello world");
  });

  const authenticate = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!req.session || !req.session.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    next();
  };

  app.use("/api/v1/auth", auth);

  app.use(authenticate);

  app.use("/api/v1/posts", posts);
  app.use("/api/v1/listings", listings);

  app.use((_, res: express.Response) => {
    res.status(404).json({ status: "404" });
  });

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`);
  });
};

main();
