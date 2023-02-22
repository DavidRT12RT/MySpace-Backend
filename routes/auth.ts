import { Router } from "express";

//Controller's
import { LoginApp } from "../controllers/auth";

const router = Router();


router.post("/login",LoginApp);

export default router;