import * as path from "path";
import * as fs from "fs";

const slash = process.platform === 'win32' ? '\\' : '/';

interface dirPath {
    relativePath:string,
    absolutePath:string,
    existsPath:boolean
};

export const processPath = (
    urlPath:string,
    urlSistema:string,
    checkExists:boolean = true 
):dirPath => {
    const relativePath = urlPath ? urlPath.replace(/--/g, slash) : slash;
    const absolutePath = path.join(__dirname,urlSistema,relativePath);

    const dirPath = {relativePath, absolutePath,existsPath:true};

    if(checkExists) {
        //Check if the file or directory exists
        dirPath.existsPath = fs.existsSync(dirPath.absolutePath);
    }

    return dirPath;
};

