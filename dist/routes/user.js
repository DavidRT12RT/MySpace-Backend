"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//Controller's
const user_1 = require("../controllers/user");
//Middleware's
const validarJWT_1 = __importDefault(require("../middlewares/validarJWT"));
const router = (0, express_1.Router)();
router.get("/", validarJWT_1.default, user_1.getUsuarios);
router.get("/:id", validarJWT_1.default, user_1.getUsuario);
router.post("/", user_1.postUsuario);
router.put("/:id", validarJWT_1.default, user_1.putUsuario);
router.delete("/:id", validarJWT_1.default, user_1.deleteUsuario);
exports.default = router;
//# sourceMappingURL=user.js.map