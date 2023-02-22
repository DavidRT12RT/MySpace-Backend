import { Router } from "express";

//Controller's
import { 
    deleteUsuario, 
    getUsuario, 
    getUsuarios, 
    postUsuario, 
    putUsuario } from "../controllers/user";

//Middleware's
import validarJWT from '../middlewares/validarJWT';

const router = Router();

router.get("/",validarJWT,getUsuarios);

router.get("/:id",validarJWT,getUsuario);

router.post("/",postUsuario);

router.put("/:id",validarJWT,putUsuario);

router.delete("/:id",validarJWT,deleteUsuario);


export default router;