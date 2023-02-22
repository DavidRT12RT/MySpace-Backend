import * as fs from "fs";
import * as path from "path";

import { Request, Response } from "express";
import bcryptjs from "bcryptjs";

//Entities
import User from "../db/entities/user";

//Helper's
import { generarJWT } from '../helpers/generarJWT';


export const getUsuarios = async(req:Request,res:Response) => {

    const usuarios = await User.find({
        where:{
            state:true
        }
    });
    return res.status(200).json(usuarios);
    
}

export const getUsuario = async(req:Request,res:Response) => {

    const { id } = req.params;

    const user = await User.findOneBy({id:parseInt(id)});

    if(!user) return res.status(404).json({msg:`User not found with id ${id}`});

    return res.status(200).json(user);

}


export const postUsuario = async(req:Request,res:Response) => {

    try {

        const body = req.body;

        //Checking if email is uniquee
        const emailExist = await User.findOne({
            where:{email:body.email}
        });
        if(emailExist) return res.status(400).json({msg:"Ya existe un usuario con ese correo!"});
        
        //Parsing to lowerCase
        body.name = body.name.toLowerCase();
        body.email = body.email.toLowerCase();

        const user = User.create(body);

        //Encrypt Password
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(user.password,salt);

        //Save user in DB
        await user.save();

        //Generate JWT
        const token = await generarJWT(user.id,user.name);

        // Create user directory 
        createUserDirectory(user.id);

        return res.status(201).json({msg:"User created successfully",token,user});
    } catch (error) {
        return res.status(500).json({msg:"Error while creating new user, contact to the administrator!!"});
    }

}

const createUserDirectory = async(id:string | number) => {

    const pathUser = path.join(__dirname,`../uploads/users/${id}/files`) ;
    // fs.mkdirSync(pathUser,{recursive:true});
    fs.promises.mkdir(pathUser,{recursive:true});

}

export const putUsuario = async(req:Request,res:Response) => {
    try {
        
        const { id } = req.params;
        const body = req.body;
        
        const user = await User.findOneBy({id:parseInt(id)});

        if(!user) return res.status(404).json({msg:`User not found with id ${id}`});

        await User.update({id:parseInt(id)},body);

        return res.json({msg:"User updated successfully!",user});
    } catch (error) {
        return res.status(500).json({msg:"Error to update user!"});
    }

}


export const deleteUsuario = async(req:Request,res:Response) => {

    try {

        //Eliminacion fisica
        //await User.delete();
        //Eliminacion logica 
        const { id } = req.params;
        const user = await User.findOneBy({id:parseInt(id)});

        if(!user) return res.status(404).json({msg:`User not found with id ${id}`});

        await User.update({id:parseInt(id)},{state:false});

        return res.status(200).json({msg:`User with ${id} deleted!`});
    } catch (error) {
        return res.status(500).json({msg:"Error to delete user"});
    }

}