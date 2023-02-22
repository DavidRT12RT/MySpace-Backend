import { DataSource } from "typeorm";

import User from "./entities/user";


const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "SyntaxError@404",
    database: "myspace",//Que db se conectara
    synchronize: true,//Leera las entidades y volvera a crearlas
    logging: true,
    entities: [
        User
    ],//Que tablas queremos que genere la db (Entidades)
    subscribers: [],
    migrations: [],
})

export default AppDataSource;