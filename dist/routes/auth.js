"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//Middleware's
const validarJWT_1 = __importDefault(require("../middlewares/validarJWT"));
//Controller's
const auth_1 = require("../controllers/auth");
const router = (0, express_1.Router)();
router.post("/login", auth_1.LoginApp);
router.post("/renew", validarJWT_1.default, auth_1.revalidateToken);
exports.default = router;
//# sourceMappingURL=auth.js.map