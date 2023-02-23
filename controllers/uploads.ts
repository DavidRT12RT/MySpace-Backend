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
        checkUserDirectory(id);

        const urlSystem = `../uploads/users/${id}/files`;
        const dirPath = processPath(req.params.path,urlSystem);

        if(dirPath.existsPath === false) return res.status(400).json({msg:"Path not exists in server"});

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
        return res.status(500).json({msg:"Error in the server getting files!"})
    }

}

export const uploadUserFile = async(req:Request,res:Response) => {

    try {
        //@ts-ignore
        const id = req.id; //Get id from JWT of user

        checkUserDirectory(id);

        if(!req.files) return res.status(400).json({msg:"Not files found!"});

        const urlSystem = `../uploads/users/${id}/files/`;
        const dirPath = processPath(req.params.path,urlSystem,true);

        //Check if directory already exits
        if(dirPath.existsPath === false) return res.status(400).json({msg:"Directory not exists to upload file"});

        for(const file in req.files) await uploadFile({file:req.files[file]},undefined,dirPath.absolutePath,true,false,false);

        const filesUploaded = Object.keys(req.files).length;
        return res.status(200).json({msg:`${ filesUploaded > 1 ? "Files" : "File"} upload successfully!`,path:dirPath.relativePath});       

    } catch (error) {
        return res.status(500).json({msg:"Error uploading file to server"});
    }

}

export const createUserDirectory = async(req:Request,res:Response) => {

    try {
        //@ts-ignore
        const id = req.id;
        checkUserDirectory(id);

        let { name,path:pathUser } = req.params;
        if(pathUser == undefined) pathUser = "/";

        if(!name) return res.status(400).json({msg:"Not name of directory specified!"});

        const urlSystem = `../uploads/users/${id}/files/`;
        const pathDirectory = processPath(`${pathUser}/${name}`,urlSystem,true);

        //Check if directory already exits
        if(pathDirectory.existsPath) return res.status(400).json({msg:"Directory already exists!"});

        await fs.promises.mkdir(pathDirectory.absolutePath);
        return res.status(201).json({msg:"Directory created successfully!"});
    } catch (error) {
        return res.status(500).json({msg:"Error creating directory in server!"});
    }

}

export const downloadUserFile = async(req:Request,res:Response) => {

    try {
        //@ts-ignore
        const id = req.id;
        checkUserDirectory(id);

        let { name,path:pathUser } = req.params;
        if(pathUser == undefined) pathUser = "/";

        const urlSystem = `../uploads/users/${id}/files/`;
        const pathFile = processPath(`${pathUser}/${name}`,urlSystem,true);
 
        (pathFile.existsPath) ? res.sendFile(pathFile.absolutePath) : res.status(404).json({msg:"File not exists in the server!"});
        
    } catch (error) {
        return res.status(500).json({msg:"Error in server downloading file"});
    }

}

export const downloadUserDirectory = async(req:Request,res:Response) => {

    try {
        //@ts-ignore
        const id = req.id;
        checkUserDirectory(id);

        let { name,path:pathUser } = req.params;
        if(pathUser == undefined) pathUser = "/";

        const urlSystem = `../uploads/users/${id}/files/`;
        const pathDirectory = processPath(`${pathUser}/${name}`,urlSystem,true);

        if(pathDirectory.existsPath === false) return res.status(404).json({msg:"Directory not exists in server"});        

        //Compress directory and send it as zip or rar
        const zip = new admZip();
        zip.addLocalFolder(pathDirectory.absolutePath);
        //get everything as a buffer
        const zipFileContents = zip.toBuffer();
        const fileName = "directory.zip";
        const fileType = "application/zip";
        res.writeHead(200, {
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Content-Type': fileType,
        })
        return res.end(zipFileContents);
        
    } catch (error) {
        return res.status(500).json({msg:"Error when downloading directory"});
    }

}

export const deleteUserFile = (req:Request,res:Response) => {

    try {
        //@ts-ignore
        const id = req.id;
        checkUserDirectory(id);

        let { name,path:pathUser } = req.params;
        if(pathUser == undefined) pathUser = "/";

        const urlSystem = `../uploads/users/${id}/files/`;
        const pathFile = processPath(`${pathUser}/${name}`,urlSystem,true);
        if(pathFile.existsPath === false) return res.status(400).json({msg:"File not exists in the server!"});
    
        //Deleting file
        fs.unlinkSync(pathFile.absolutePath);

        return res.status(200).json({msg:`File ${name} deleted successfully`});
    } catch (error) {
        return res.status(500).json({msg:"Error deleting file in the server"});
    }

}

export const deleteUserDirectory = (req:Request,res:Response) => {        

    try {
        //@ts-ignore
        const id = req.id;
        checkUserDirectory(id);

        let { name,path:pathUser } = req.params;
        if(pathUser == undefined) pathUser = "/";

        const urlSystem = `../uploads/users/${id}/files/`;
        const pathDirectory = processPath(`${pathUser}/${name}`,urlSystem,true);

        if(pathDirectory.existsPath === false) return res.status(404).json({msg:`Directory ${name} not found in server!`});

        fs.rmSync(pathDirectory.absolutePath, { recursive: true, force: true });

        return res.status(200).json({msg:`Directory ${name} deleted successfully!`});
    } catch (error) {
        return res.status(500).json({msg:"Error deleting directory in the server"});
    }

}

const checkUserDirectory = (id:number | string) => {

    //Check if user have his own directory in uploads
    const pathUser = path.join(__dirname,`../uploads/users/${id}/files`);

    //If it doesnt exists we need to create it
    if(!fs.existsSync(pathUser)) fs.mkdirSync(pathUser,{recursive:true});

}