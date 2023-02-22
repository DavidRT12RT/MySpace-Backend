//@ts-nocheck
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

const uploadFile = (
    files,
    validExtensions=['png','jpg','jpeg','gif','pdf'],
    directory='',
    processPath=false,
    changeName=true,
    checkExtension=true ) => {

    return new Promise((resolve,reject) => {
        
        const { file } = files;

        const nombreCortado = file.name.split('.');
        const extension = nombreCortado[nombreCortado.length-1];

        if(checkExtension){
            if(!validExtensions.includes(extension)) return reject(`La extension ${extension} NO es valida! ${validExtensions}`);
        }

        const nombreTemp = changeName ? (uuidv4()+'.'+extension) : file.name;

        //El path sera donde me encuentro , ruta,nombre
        const uploadPath = processPath ? (path.join(directory,nombreTemp)) : (path.join(__dirname,'../uploads/',directory,nombreTemp));

        // Use the mv() method to place the file somewhere on your server
        file.mv(uploadPath, (err)=>{
            if (err) return reject(err);
            resolve(nombreTemp);
        });

    });

}

export default uploadFile;