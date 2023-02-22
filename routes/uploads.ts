import { Router } from "express";

//Middleware's
import validarJWT from '../middlewares/validarJWT';

//Controller's
import { createUserDirectory, downloadUserDirectory, downloadUserFile, getUserFilesPath, uploadUserFile } from "../controllers/uploads";

const router = Router();

//Get user's files
router.get("/files/:path?",validarJWT,getUserFilesPath);

//Upload file
router.post("/files/:path?",validarJWT,uploadUserFile);

//Create directory
router.post("/files/create-directory/:path?/:name",validarJWT,createUserDirectory);

//Download file
router.get("/files/download-file/:path?/:name",downloadUserFile);

//Download directory
router.get("/files/download-directory/:path?/:name",validarJWT,downloadUserDirectory);


export default router;