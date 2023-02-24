"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//Middleware's
const validarJWT_1 = __importDefault(require("../middlewares/validarJWT"));
//Controller's
const uploads_1 = require("../controllers/uploads");
const router = (0, express_1.Router)();
//Get user's files
router.get("/files/get-files/:path?", validarJWT_1.default, uploads_1.getUserFilesPath);
//Upload file
router.post("/files/upload-file/:path?", validarJWT_1.default, uploads_1.uploadUserFile);
//Create directory
router.post("/files/create-directory/:path?/:name", validarJWT_1.default, uploads_1.createUserDirectory);
//Download file
router.get("/files/download-file/:path?/:name", validarJWT_1.default, uploads_1.downloadUserFile);
//Download directory
router.get("/files/download-directory/:path?/:name", validarJWT_1.default, uploads_1.downloadUserDirectory);
//Eliminate file
router.delete("/files/delete-file/:path?/:name", validarJWT_1.default, uploads_1.deleteUserFile);
//Delete directory
router.delete("/files/delete-directory/:path?/:name", validarJWT_1.default, uploads_1.deleteUserDirectory);
exports.default = router;
//# sourceMappingURL=uploads.js.map