"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_1 = __importDefault(require("./entities/user"));
const AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "SyntaxError@404",
    database: "myspace",
    synchronize: true,
    logging: true,
    entities: [
        user_1.default
    ],
    subscribers: [],
    migrations: [],
});
exports.default = AppDataSource;
//# sourceMappingURL=connection.js.map