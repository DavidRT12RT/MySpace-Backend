import * as path from "path";

const slash = process.platform === 'win32' ? '\\' : '/';

export const processPath = (urlPath:string,urlSistema:string) => {
    const relativePath = urlPath ? urlPath.replace(/--/g, slash) : slash;
    //const absolutePath = path.join(__dirname,`../uploads/obras/${id}/archivosGenerales`,relativePath);
    const absolutePath = path.join(__dirname,urlSistema,relativePath);
    return { relativePath, absolutePath };
};

