import * as fs from "fs";
import * as path from "path";

import { Request,Response } from "express";
import admZip from "adm-zip";

//Helper's
import { processPath } from "../helpers/processPath";
import uploadFile from "../helpers/uploadFile";


export const getUserFilesPath = async(req:Request,res:Response) => {

    try {

        //@ts-ignore
        const id = req.id; //Get id from JWT of user

        const urlSistema = `../uploads/users/${id}/files`;
        const dirPath = processPath(req.params.path,urlSistema);
        const dir = await fs.promises.opendir(dirPath.absolutePath);
        const content = {files:[] as string[],directories:[] as string[]};

        for await (const dirent of dir){
            if(dirent.isDirectory()) content.directories.push(dirent.name);
            else content.files.push(dirent.name);
        }

        content.directories.sort();
        content.files.sort();

        return res.status(200).json({path:dirPath.relativePath,content});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:"Error getting files!"})
    }

}

export const uploadUserFile = async(req:Request,res:Response) => {

    try {

        //@ts-ignore
        const id = req.id; //Get id from JWT of user

        if(!req.files) return res.status(400).json({msg:"Not files found!"});

        const urlSistema = `../uploads/users/${id}/files/`;
        const dirPath = processPath(req.params.path,urlSistema);
        for(const file in req.files) await uploadFile({file:req.files[file]},undefined,dirPath.absolutePath,true,false,false);
        return res.status(200).json({msg:"File upload successfully!",path:dirPath.relativePath});       

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:"Error uploading file to server"});
    }

}

export const createUserDirectory = async(req:Request,res:Response) => {

    //@ts-ignore
    const id = req.id;

    const urlSistema = `../uploads/users/${id}/files/`;
    const dirPath = processPath(req.params.path,urlSistema);
 
    const { name } = req.params;
    if(!name) return res.status(400).json({msg:"Not name of directory specified!"});

    try {
        await fs.promises.mkdir(path.join(dirPath.absolutePath, name));
        return res.status(201).json({msg:"Directory created successfully!"});
    } catch (error) {
        return res.status(500).json({msg:"Error creating directory in server!"});
    }

}

export const downloadUserFile = async(req:Request,res:Response) => {

    //@ts-ignore
    const id = req.id;

    const urlSistema = `../uploads/users/${id}/files`;
    const dirPath = processPath(req.params.path,urlSistema);
 
    const pathArchivo = path.join(dirPath.absolutePath,req.params.name);
    (fs.existsSync(pathArchivo)) ? res.sendFile(pathArchivo) : res.status(404).json({msg:"Archivo NO encontrado en el servidor!"});
}

export const downloadUserDirectory = async(req:Request,res:Response) => {

    //@ts-ignore
    const id = req.id;
    const { name } = req.params;

    const urlSistema = `../uploads/users/${id}/files`;
    const dirPath = processPath(req.params.path,urlSistema);
    const pathFolder = path.join(dirPath.absolutePath,name);

    if(!fs.existsSync(pathFolder)) return res.status(404).json({msg:"carpeta NO encontrada en el servidor"});        

    //Comprimimos la carpeta para enviarla como zip o rar
    const zip = new admZip();
    zip.addLocalFolder(pathFolder);
    //get everything as a buffer
    const zipFileContents = zip.toBuffer();
    const fileName = "directory.zip";
    const fileType = "application/zip";
    res.writeHead(200, {
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Type': fileType,
    })
    return res.end(zipFileContents);
}