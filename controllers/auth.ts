import { Request,Response } from "express";
import bcryptjs from "bcryptjs";


import User from "../db/entities/user";
import { generarJWT } from '../helpers/generarJWT';

export const LoginApp = async(req:Request,res:Response) => {


    const { email,password } = req.body;

    const user = await User.findOneBy({email});

    if(!user) return res.status(404).json({msg:"No user found with that email!!"});

    const isPasswordValid = bcryptjs.compareSync(password,user.password);

    if(!isPasswordValid) return res.status(400).json({msg:"Password incorrect!"});

    //Generate JWT 
    const token = await generarJWT(user.id,user.name);

    return res.status(200).json({msg:"Sucessfully login",token,user});
}


export const revalidateToken = async(req:Request,res:Response) => {

    try {
        //@ts-ignore
        const user = req.user;

        //Generate new JWT and return 
        const token = await generarJWT(user.id,user.name);

        return res.status(200).json({user,token});
        
    } catch (error) {
        return res.status(500).json("Token not validate");
    }

}