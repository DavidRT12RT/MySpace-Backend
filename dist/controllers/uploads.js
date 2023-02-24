"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserDirectory = exports.deleteUserFile = exports.downloadUserDirectory = exports.downloadUserFile = exports.createUserDirectory = exports.uploadUserFile = exports.getUserFilesPath = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const adm_zip_1 = __importDefault(require("adm-zip"));
//Helper's
const processPath_1 = require("../helpers/processPath");
const uploadFile_1 = __importDefault(require("../helpers/uploadFile"));
const getUserFilesPath = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    console.log("Peticion!");
    try {
        //@ts-ignore
        const id = req.id; //Get id from JWT of user
        checkUserDirectory(id);
        const urlSystem = `../uploads/users/${id}/files`;
        const dirPath = (0, processPath_1.processPath)(req.params.path, urlSystem);
        if (dirPath.existsPath === false)
            return res.status(400).json({ msg: "Path not exists in server" });
        const dir = yield fs.promises.opendir(dirPath.absolutePath);
        const content = { files: [], directories: [] };
        try {
            for (var _d = true, dir_1 = __asyncValues(dir), dir_1_1; dir_1_1 = yield dir_1.next(), _a = dir_1_1.done, !_a;) {
                _c = dir_1_1.value;
                _d = false;
                try {
                    const dirent = _c;
                    if (dirent.isDirectory())
                        content.directories.push(dirent.name);
                    else
                        content.files.push(dirent.name);
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = dir_1.return)) yield _b.call(dir_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        content.directories.sort();
        content.files.sort();
        return res.status(200).json({ path: dirPath.relativePath, content });
    }
    catch (error) {
        return res.status(500).json({ msg: "Error in the server getting files!" });
    }
});
exports.getUserFilesPath = getUserFilesPath;
const uploadUserFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const id = req.id; //Get id from JWT of user
        checkUserDirectory(id);
        if (!req.files)
            return res.status(400).json({ msg: "Not files found!" });
        const urlSystem = `../uploads/users/${id}/files/`;
        const dirPath = (0, processPath_1.processPath)(req.params.path, urlSystem, true);
        //Check if directory already exits
        if (dirPath.existsPath === false)
            return res.status(400).json({ msg: "Directory not exists to upload file" });
        for (const file in req.files)
            yield (0, uploadFile_1.default)({ file: req.files[file] }, undefined, dirPath.absolutePath, true, false, false);
        const filesUploaded = Object.keys(req.files).length;
        return res.status(200).json({ msg: `${filesUploaded > 1 ? "Files" : "File"} upload successfully!`, path: dirPath.relativePath });
    }
    catch (error) {
        return res.status(500).json({ msg: "Error uploading file to server" });
    }
});
exports.uploadUserFile = uploadUserFile;
const createUserDirectory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const id = req.id;
        checkUserDirectory(id);
        let { name, path: pathUser } = req.params;
        if (pathUser == undefined)
            pathUser = "/";
        if (!name)
            return res.status(400).json({ msg: "Not name of directory specified!" });
        const urlSystem = `../uploads/users/${id}/files/`;
        const pathDirectory = (0, processPath_1.processPath)(`${pathUser}/${name}`, urlSystem, true);
        //Check if directory already exits
        if (pathDirectory.existsPath)
            return res.status(400).json({ msg: "Directory already exists!" });
        yield fs.promises.mkdir(pathDirectory.absolutePath);
        return res.status(201).json({ msg: "Directory created successfully!" });
    }
    catch (error) {
        return res.status(500).json({ msg: "Error creating directory in server!" });
    }
});
exports.createUserDirectory = createUserDirectory;
const downloadUserFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const id = req.id;
        checkUserDirectory(id);
        let { name, path: pathUser } = req.params;
        if (pathUser == undefined)
            pathUser = "/";
        const urlSystem = `../uploads/users/${id}/files/`;
        const pathFile = (0, processPath_1.processPath)(`${pathUser}/${name}`, urlSystem, true);
        (pathFile.existsPath) ? res.sendFile(pathFile.absolutePath) : res.status(404).json({ msg: "File not exists in the server!" });
    }
    catch (error) {
        return res.status(500).json({ msg: "Error in server downloading file" });
    }
});
exports.downloadUserFile = downloadUserFile;
const downloadUserDirectory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const id = req.id;
        checkUserDirectory(id);
        let { name, path: pathUser } = req.params;
        if (pathUser == undefined)
            pathUser = "/";
        const urlSystem = `../uploads/users/${id}/files/`;
        const pathDirectory = (0, processPath_1.processPath)(`${pathUser}/${name}`, urlSystem, true);
        if (pathDirectory.existsPath === false)
            return res.status(404).json({ msg: "Directory not exists in server" });
        //Compress directory and send it as zip or rar
        const zip = new adm_zip_1.default();
        zip.addLocalFolder(pathDirectory.absolutePath);
        //get everything as a buffer
        const zipFileContents = zip.toBuffer();
        const fileName = "directory.zip";
        const fileType = "application/zip";
        res.writeHead(200, {
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Content-Type': fileType,
        });
        return res.end(zipFileContents);
    }
    catch (error) {
        return res.status(500).json({ msg: "Error when downloading directory" });
    }
});
exports.downloadUserDirectory = downloadUserDirectory;
const deleteUserFile = (req, res) => {
    try {
        //@ts-ignore
        const id = req.id;
        checkUserDirectory(id);
        let { name, path: pathUser } = req.params;
        if (pathUser == undefined)
            pathUser = "/";
        const urlSystem = `../uploads/users/${id}/files/`;
        const pathFile = (0, processPath_1.processPath)(`${pathUser}/${name}`, urlSystem, true);
        if (pathFile.existsPath === false)
            return res.status(400).json({ msg: "File not exists in the server!" });
        //Deleting file
        fs.unlinkSync(pathFile.absolutePath);
        return res.status(200).json({ msg: `File ${name} deleted successfully` });
    }
    catch (error) {
        return res.status(500).json({ msg: "Error deleting file in the server" });
    }
};
exports.deleteUserFile = deleteUserFile;
const deleteUserDirectory = (req, res) => {
    try {
        //@ts-ignore
        const id = req.id;
        checkUserDirectory(id);
        let { name, path: pathUser } = req.params;
        if (pathUser == undefined)
            pathUser = "/";
        const urlSystem = `../uploads/users/${id}/files/`;
        const pathDirectory = (0, processPath_1.processPath)(`${pathUser}/${name}`, urlSystem, true);
        if (pathDirectory.existsPath === false)
            return res.status(404).json({ msg: `Directory ${name} not found in server!` });
        fs.rmSync(pathDirectory.absolutePath, { recursive: true, force: true });
        return res.status(200).json({ msg: `Directory ${name} deleted successfully!` });
    }
    catch (error) {
        return res.status(500).json({ msg: "Error deleting directory in the server" });
    }
};
exports.deleteUserDirectory = deleteUserDirectory;
const checkUserDirectory = (id) => {
    //Check if user have his own directory in uploads
    const pathUser = path.join(__dirname, `../uploads/users/${id}/files`);
    //If it doesnt exists we need to create it
    if (!fs.existsSync(pathUser))
        fs.mkdirSync(pathUser, { recursive: true });
};
//# sourceMappingURL=uploads.js.map