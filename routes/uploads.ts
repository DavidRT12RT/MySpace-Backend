import { Router } from "express";

//Middleware's
import validarJWT from '../middlewares/validarJWT';

//Controller's
import { createUserDirectory, deleteUserDirectory, deleteUserFile, downloadUserDirectory, downloadUserFile, getUserFilesPath, uploadUserFile } from "../controllers/uploads";

const router = Router();

//Get user's files
router.get("/files/get-files/:path?",validarJWT,getUserFilesPath);

//Upload file
router.post("/files/upload-file/:path?",validarJWT,uploadUserFile);

//Create directory
router.post("/files/create-directory/:path?/:name",validarJWT,createUserDirectory);

//Download file
router.get("/files/download-file/:path?/:name",validarJWT,downloadUserFile);

//Download directory
router.get("/files/download-directory/:path?/:name",validarJWT,downloadUserDirectory);

//Eliminate file
router.delete("/files/delete-file/:path?/:name",validarJWT,deleteUserFile);

//Delete directory
router.delete("/files/delete-directory/:path?/:name",validarJWT,deleteUserDirectory);


export default router;