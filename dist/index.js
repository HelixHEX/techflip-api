"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv-safe/config");
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors = require("cors");
const posts = require('./routes/posts');
const listings = require('./routes/listings');
const main = () => {
    const app = express_1.default();
    morgan_1.default.token('body', (req, res) => JSON.stringify(req.body));
    app.use(morgan_1.default(":remote-user [:date[clf]] ':method :status :url HTTP/:http-version' :body ':user-agent' - :response-time ms"));
    app.use(cors({ origin: ['http://localhost:3000'] }));
    app.use(express_1.default.json());
    app.get("/", (_, res) => {
        res.send("Hello world");
    });
    app.use('/api/v1/posts', posts);
    app.use('/api/v1/listings', listings);
    app.use((_, res) => {
        res.status(404).json({ status: "404" });
    });
    app.listen(process.env.PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`);
    });
};
main();
//# sourceMappingURL=index.js.map