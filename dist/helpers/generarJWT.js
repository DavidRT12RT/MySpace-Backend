"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarJWT = void 0;
//@ts-nocheck
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generarJWT = (id, name) => {
    return new Promise((resolve, reject) => {
        const payload = { id, name };
        //Generar un nuevo token
        jsonwebtoken_1.default.sign(payload, process.env.PRIVATE_KEY, {
            expiresIn: "168h"
        }, (error, token) => {
            if (error)
                return reject("No se puede generar el token");
            else
                return resolve(token);
        });
    });
};
exports.generarJWT = generarJWT;
//# sourceMappingURL=generarJWT.js.map