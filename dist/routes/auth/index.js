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
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
const saltRounds = 10;
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (email === "" || password === "" || !email || !password) {
            res
                .status(400)
                .json({ success: false, message: "Incorrect email or password" });
        }
        else {
            const user = yield prisma.user.findUnique({ where: { email } });
            if (user) {
                let checkPass = yield bcrypt_1.default.compare(password, user.password);
                if (checkPass) {
                    req.session.user = user;
                    res.status(200).json({ success: true });
                }
                else {
                    res
                        .status(400)
                        .json({ success: false, message: "Incorrect email or password" });
                }
            }
        }
    }
    catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
}));
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        if (name === "" || email === "" || password === "") {
            res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }
        else {
            const exists = yield prisma.user.findUnique({ where: { email } });
            if (!exists) {
                bcrypt_1.default.hash(password, saltRounds, (_, hash) => __awaiter(void 0, void 0, void 0, function* () {
                    let hashPwd = hash;
                    const user = yield prisma.user.create({
                        data: { name, email, password: hashPwd },
                    });
                    if (user) {
                        req.session.user = user;
                        res.json({ success: true });
                    }
                    else {
                        res.json({ success: false, message: "An error has occurred" });
                    }
                }));
            }
            else {
                res.json({ success: false, message: "Email already in use" });
            }
        }
    }
    catch (e) {
        res.status(500).send({ success: false, message: e.message });
    }
}));
router.post("/logout", (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).json({ success: false, message: "Unable to logout" });
            }
            else {
                res.json({ success: true });
            }
        });
    }
    catch (e) {
        res.status(500).send({ success: false, message: e.message });
    }
});
module.exports = router;
//# sourceMappingURL=index.js.map