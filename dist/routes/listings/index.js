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
router.post("/new", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, image, price } = req.body;
    try {
        if (title === "" || description === "") {
            res.status(400).json({ success: false, message: "Missing data" });
            return;
        }
        yield prisma.listing.create({
            data: {
                title,
                description,
                price,
                image,
                creator: {
                    connect: {
                        id: req.session.user.id,
                    },
                },
            },
        });
        res.status(200).json({ success: true });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "An error has occurred" });
    }
}));
router.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listings = yield prisma.listing.findMany({
            include: {
                creator: { select: { name: true, email: true, id: true } },
            },
        });
        res.status(200).json({ success: true, listings });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "An error has occurred" });
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    try {
        const post = yield prisma.listing.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                creator: { select: { name: true, email: true, id: true } },
            },
        });
        res.status(200).json({ success: true, post });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "An error has occurred" });
    }
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    const { title, description, image, price } = req.body;
    try {
        const post = yield prisma.listing.findUnique({
            where: { id: parseInt(id) },
            include: { creator: true },
        });
        if (post) {
            if (post.creator_id === req.session.user.id) {
                const updatedPost = yield prisma.listing.update({
                    where: {
                        id: parseInt(id),
                    },
                    data: {
                        title,
                        description,
                        image,
                        price,
                    },
                });
                res.status(200).json({ success: true, updatedPost });
            }
            else {
                res.status(401).json({ success: false, message: "Unauthorized" });
            }
        }
        else {
            res.status(404).json({ success: false, message: "Post not found" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "An error has occurred" });
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    try {
        const post = yield prisma.listing.findUnique({
            where: { id: parseInt(id) },
            include: { creator: true },
        });
        if (post) {
            if (post.creator_id === req.session.user.id) {
                yield prisma.listing.delete({
                    where: {
                        id: parseInt(id),
                    },
                });
                res.status(200).json({ success: true, message: "Post deleted" });
            }
            else {
                res.status(401).json({ success: false, message: "Unauthorized" });
            }
        }
        else {
            res.status(404).json({ success: false, message: "Post not found" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "An error has occurred" });
    }
}));
module.exports = router;
//# sourceMappingURL=index.js.map