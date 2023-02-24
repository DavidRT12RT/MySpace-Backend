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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../db/entities/user"));
const validarJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //Next es una funcion que sera proporcionada por express-validator y simplemente saltara al siguiente middleware o controlador
    const token = req.header("x-token");
    if (!token)
        return res.status(401).json({ msg: "Not token in headers!" });
    try {
        const { id } = jsonwebtoken_1.default.verify(token, process.env.PRIVATE_KEY);
        const user = yield user_1.default.findOneBy({ id });
        if (!user)
            return res.status(404).json({ msg: "User not found with token!" });
        if (!user.state)
            return res.status(403).json({ msg: "User with not valid state in DB" });
        req.user = user;
        req.id = id;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ msg: "Token not valid!" });
    }
});
exports.default = validarJWT;
//# sourceMappingURL=validarJWT.js.map