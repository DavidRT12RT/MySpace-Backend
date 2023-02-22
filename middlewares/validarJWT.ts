//@ts-nocheck
import { Request,Response } from "express";
import jwt from "jsonwebtoken";
import User from "../db/entities/user";




const validarJWT = async(req:Request,res:Response,next:Function) => {
    //Next es una funcion que sera proporcionada por express-validator y simplemente saltara al siguiente middleware o controlador

    const token = req.header("x-token");
    if(!token) return res.status(401).json({msg:"Not token in headers!"});

    try {


        const { id } = jwt.verify(token,process.env.PRIVATE_KEY!);

        const user = await User.findOneBy({id});

        if(!user) return res.status(404).json({msg:"User not found with token!"});

        if(!user.state) return res.status(403).json({msg:"User with not valid state in DB"});

        req.user = user;
        req.id = id;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({msg:"Token not valid!"});
    }
}

export default validarJWT;