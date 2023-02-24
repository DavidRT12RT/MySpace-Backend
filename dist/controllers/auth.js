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
exports.revalidateToken = exports.LoginApp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../db/entities/user"));
const generarJWT_1 = require("../helpers/generarJWT");
const LoginApp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_1.default.findOneBy({ email });
    if (!user)
        return res.status(404).json({ msg: "No user found with that email!!" });
    const isPasswordValid = bcryptjs_1.default.compareSync(password, user.password);
    if (!isPasswordValid)
        return res.status(400).json({ msg: "Password incorrect!" });
    //Generate JWT 
    const token = yield (0, generarJWT_1.generarJWT)(user.id, user.name);
    return res.status(200).json({ msg: "Sucessfully login", token, user });
});
exports.LoginApp = LoginApp;
const revalidateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const user = req.user;
        //Generate new JWT and return 
        const token = yield (0, generarJWT_1.generarJWT)(user.id, user.name);
        return res.status(200).json({ user, token });
    }
    catch (error) {
        return res.status(500).json({ msg: "Token not validate" });
    }
});
exports.revalidateToken = revalidateToken;
//# sourceMappingURL=auth.js.map