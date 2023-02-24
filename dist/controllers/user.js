"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteUsuario = exports.putUsuario = exports.postUsuario = exports.getUsuario = exports.getUsuarios = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//Entities
const user_1 = __importDefault(require("../db/entities/user"));
//Helper's
const generarJWT_1 = require("../helpers/generarJWT");
const getUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuarios = yield user_1.default.find({
        where: {
            state: true
        }
    });
    return res.status(200).json(usuarios);
});
exports.getUsuarios = getUsuarios;
const getUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_1.default.findOneBy({ id: parseInt(id) });
    if (!user)
        return res.status(404).json({ msg: `User not found with id ${id}` });
    return res.status(200).json(user);
});
exports.getUsuario = getUsuario;
const postUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        //Checking if email is uniquee
        const emailExist = yield user_1.default.findOne({
            where: { email: body.email }
        });
        if (emailExist)
            return res.status(400).json({ msg: "Ya existe un usuario con ese correo!" });
        //Parsing to lowerCase
        body.name = body.name.toLowerCase();
        body.email = body.email.toLowerCase();
        const user = user_1.default.create(body);
        //Encrypt Password
        const salt = bcryptjs_1.default.genSaltSync();
        user.password = bcryptjs_1.default.hashSync(user.password, salt);
        //Save user in DB
        yield user.save();
        //Generate JWT
        const token = yield (0, generarJWT_1.generarJWT)(user.id, user.name);
        // Create user directory 
        createUserDirectory(user.id);
        return res.status(201).json({ msg: "User created successfully", token, user });
    }
    catch (error) {
        return res.status(500).json({ msg: "Error while creating new user, contact to the administrator!!" });
    }
});
exports.postUsuario = postUsuario;
const createUserDirectory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const pathUser = path.join(__dirname, `../uploads/users/${id}/files`);
    // fs.mkdirSync(pathUser,{recursive:true});
    fs.promises.mkdir(pathUser, { recursive: true });
});
const putUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const body = req.body;
        const user = yield user_1.default.findOneBy({ id: parseInt(id) });
        if (!user)
            return res.status(404).json({ msg: `User not found with id ${id}` });
        yield user_1.default.update({ id: parseInt(id) }, body);
        return res.json({ msg: "User updated successfully!", user });
    }
    catch (error) {
        return res.status(500).json({ msg: "Error to update user!" });
    }
});
exports.putUsuario = putUsuario;
const deleteUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Eliminacion fisica
        //await User.delete();
        //Eliminacion logica 
        const { id } = req.params;
        const user = yield user_1.default.findOneBy({ id: parseInt(id) });
        if (!user)
            return res.status(404).json({ msg: `User not found with id ${id}` });
        yield user_1.default.update({ id: parseInt(id) }, { state: false });
        return res.status(200).json({ msg: `User with ${id} deleted!` });
    }
    catch (error) {
        return res.status(500).json({ msg: "Error to delete user" });
    }
});
exports.deleteUsuario = deleteUsuario;
//# sourceMappingURL=user.js.map