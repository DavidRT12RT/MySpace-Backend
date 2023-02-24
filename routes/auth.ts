import { Router } from "express";

//Middleware's
import validarJWT from '../middlewares/validarJWT';

//Controller's
import { LoginApp, revalidateToken } from "../controllers/auth";

const router = Router();


router.post("/login",LoginApp);

router.post("/renew",validarJWT,revalidateToken);

export default router;