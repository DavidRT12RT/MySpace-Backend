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
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
const uploadFile = (files, validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'pdf'], directory = '', processPath = false, changeName = true, checkExtension = true) => {
    return new Promise((resolve, reject) => {
        const { file } = files;
        const nombreCortado = file.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        if (checkExtension) {
            if (!validExtensions.includes(extension))
                return reject(`La extension ${extension} NO es valida! ${validExtensions}`);
        }
        const nombreTemp = changeName ? ((0, uuid_1.v4)() + '.' + extension) : file.name;
        //El path sera donde me encuentro , ruta,nombre
        const uploadPath = processPath ? (path.join(directory, nombreTemp)) : (path.join(__dirname, '../uploads/', directory, nombreTemp));
        // Use the mv() method to place the file somewhere on your server
        file.mv(uploadPath, (err) => {
            if (err)
                return reject(err);
            resolve(nombreTemp);
        });
    });
};
exports.default = uploadFile;
//# sourceMappingURL=uploadFile.js.map