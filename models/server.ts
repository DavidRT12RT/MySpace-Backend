import express from "express";
import cors from "cors";
import morgan from "morgan";
import fileUpload from "express-fileupload";

//Route's
import userRoutes from "../routes/user";
import authRoutes from "../routes/auth";
import uploadsRoutes from "../routes/uploads";

//DB
import AppDataSource  from "../db/connection";

class Server{
    //Propiedades de la clase
    private app:express.Application;
    private port:String | Number;
    private apiPaths;


    constructor(){
        this.app = express();
        this.port = process.env.PORT || "80",
        this.apiPaths = {
            usuarios:"/api/users",
            auth:"/api/auth",
            uploads:"/api/uploads"
        },
        
        //Metodos iniciales
        this.middlewares(); 
        this.dbConnection();
        this.routes(); 
    }

    listen(){
        this.app.listen(this.port,() => {
            console.log(`Servidor corriendo ${this.port}`);
        })
    }
    
    routes(){
        this.app.use(this.apiPaths.usuarios,userRoutes);
        this.app.use(this.apiPaths.auth,authRoutes);
        this.app.use(this.apiPaths.uploads,uploadsRoutes);
    }

    middlewares(){
        //Middlewares son funciones que se ejecutan antes que otros procedimientos
        this.app.use(cors()); //CORS(CROSS DOMAIN POR DEFECTO)
        this.app.use(express.json()); //Parseo del body(Entender objectos JSON que vienen en el body)
        this.app.use(morgan("dev"));//Ver peticiones que llegan en consola
        this.app.use(fileUpload({
            useTempFiles:true,
            tempFileDir:"/tmp",
            createParentPath:true
        }));//FileUpload
        this.app.use(express.static("public")); //Carpeta publica contenido estatico
    }

    async dbConnection(){
        try {
            await AppDataSource.initialize();
           console.log("Base de datos ONLINE!!");
        } catch (error:any) {
            throw new Error(error);
        }
    }

}

export default Server;