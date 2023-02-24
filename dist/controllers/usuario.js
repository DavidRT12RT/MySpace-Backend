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
exports.deleteUsuario = exports.putUsuario = exports.postUsuario = exports.getUsuario = exports.getUsuarios = void 0;
const usuario_1 = __importDefault(require("../models/usuario"));
const getUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuarios = yield usuario_1.default.findAll({
        where: {
            estado: true
        }
    });
    res.json({ usuarios });
});
exports.getUsuarios = getUsuarios;
const getUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const usuario = yield usuario_1.default.findByPk(id); //Pk == Id en moongose
    if (!usuario)
        return res.status(404).json({ msg: `Usuario no encontrado con id ${id}!` });
    return res.json({ usuario });
});
exports.getUsuario = getUsuario;
const postUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const existeEmail = yield usuario_1.default.findOne({
            where: { email: body.email }
        });
        if (existeEmail)
            return res.status(400).json({ msg: "Ya existe un usuario con ese correo!" });
        const usuario = usuario_1.default.build(body);
        yield usuario.save();
        //Shortcut to the create model
        // await User.create();
        return res.json({ msg: "Post usuario!", body });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error al crear el usuario , hable con el administrador!" });
    }
});
exports.postUsuario = postUsuario;
const putUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const body = req.body;
        const usuario = yield usuario_1.default.findByPk(id);
        if (!usuario)
            return res.status(404).json({ msg: "Usuario no encontrado!" });
        yield usuario.update(body);
        return res.json({ msg: "Usuario actualizado con exito!", usuario });
    }
    catch (error) {
        return res.status(500).json({ msg: "Error al actualizar usuario!" });
    }
});
exports.putUsuario = putUsuario;
const deleteUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const usuario = yield usuario_1.default.findByPk(id);
    if (!usuario)
        return res.status(404).json({ msg: "Usuario no encontrado!" });
    //Eliminacion fisica
    //await usuario.destroy();
    //Eliminacion logica 
    yield usuario.update({ estado: false });
    return res.status(200).json({ msg: `Usuario con id ${id} eliminado!` });
});
exports.deleteUsuario = deleteUsuario;
//# sourceMappingURL=usuario.js.map