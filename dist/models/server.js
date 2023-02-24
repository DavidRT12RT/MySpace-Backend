"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
//Route's
const user_1 = __importDefault(require("../routes/user"));
const auth_1 = __importDefault(require("../routes/auth"));
const uploads_1 = __importDefault(require("../routes/uploads"));
//DB
const connection_1 = __importDefault(require("../db/connection"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || "80",
            this.apiPaths = {
                usuarios: "/api/users",
                auth: "/api/auth",
                uploads: "/api/uploads"
            },
            //Metodos iniciales
            this.middlewares();
        this.dbConnection();
        this.routes();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo ${this.port}`);
        });
    }
    routes() {
        this.app.use(this.apiPaths.usuarios, user_1.default);
        this.app.use(this.apiPaths.auth, auth_1.default);
        this.app.use(this.apiPaths.uploads, uploads_1.default);
    }
    middlewares() {
        //Middlewares son funciones que se ejecutan antes que otros procedimientos
        this.app.use((0, cors_1.default)()); //CORS(CROSS DOMAIN POR DEFECTO)
        this.app.use(express_1.default.json()); //Parseo del body(Entender objectos JSON que vienen en el body)
        this.app.use((0, morgan_1.default)("dev")); //Ver peticiones que llegan en consola
        this.app.use((0, express_fileupload_1.default)({
            useTempFiles: true,
            tempFileDir: "/tmp",
            createParentPath: true
        })); //FileUpload
        this.app.use(express_1.default.static("public")); //Carpeta publica contenido estatico
        //Haciendo que cualquier ruta que llegue sirva el directorio publico donde esta la appa de react de una vez
        this.app.use("*", express_1.default.static("public"));
    }
    dbConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connection_1.default.initialize();
                console.log("Base de datos ONLINE!!");
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map