"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.post('/new', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    try {
        if (title === "" || content === "") {
            res.status(400).json({ success: false, message: "Missing data" });
        }
        const post = yield prisma.post.create({
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
        res.status(200).json({ success: true, post });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "An error has occurred" });
    }
}));
router.get('/', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield prisma.post.findMany({
            include: {
                creator: { select: { name: true, email: true, id: true } }
            }
        });
        res.status(200).json({ success: true, posts });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "An error has occurred" });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    try {
        const post = yield prisma.post.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                creator: { select: { name: true, email: true, id: true } }
            }
        });
        res.status(200).json({ success: true, post });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "An error has occurred" });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    const { title, content } = req.body;
    try {
        if (title === "" || content === "") {
            res.status(400).json({ success: false, message: "Missing data" });
        }
        const post = yield prisma.post.update({
            where: {
                id: parseInt(id)
            },
            data: {
                title,
                content
            }
        });
        res.status(200).json({ success: true, post });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "An error has occurred" });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    try {
        const post = yield prisma.post.findUnique({ where: { id: parseInt(id) }, include: { creator: true } });
        if (!post) {
            res.status(404).json({ success: false, message: "Post not found" });
        }
        else if (post.creator_id !== req.session.user.id) {
            res.status(401).json({ success: false, message: "Unauthorized" });
        }
        else {
            yield prisma.post.delete({
                where: {
                    id: parseInt(id)
                }
            });
            res.status(200).json({ success: true });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "An error has occurred" });
    }
}));
router.get('/user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    try {
        const posts = yield prisma.post.findMany({
            where: {
                creator_id: id
            },
            include: {
                creator: { select: { name: true, email: true, id: true } }
            }
        });
        res.status(200).json({ success: true, posts });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "An error has occurred" });
    }
}));
router.post('/comment/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    const { content } = req.body;
    try {
        if (content === "") {
            res.status(400).json({ success: false, message: "Missing data" });
        }
        const post = yield prisma.post.findUnique({ where: { id: parseInt(id) }, include: { creator: true } });
        if (!post) {
            res.status(404).json({ success: false, message: "Post not found" });
        }
        else {
            const comment = yield prisma.comment.create({
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
            res.status(200).json({ success: true, comment });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "An error has occurred" });
    }
}));
module.exports = router;
//# sourceMappingURL=index.js.map