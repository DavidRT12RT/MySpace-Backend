//@ts-nocheck
import jwt from "jsonwebtoken";

export const generarJWT = (id:string | number,name:string) => {
    return new Promise((resolve,reject) => {
        const payload = {id,name};

        //Generar un nuevo token
        jwt.sign(payload,process.env.PRIVATE_KEY,{
            expiresIn:"168h"
        },(error,token) => {
            if(error) return reject("No se puede generar el token");
            else return resolve(token);
        });
    });
}
