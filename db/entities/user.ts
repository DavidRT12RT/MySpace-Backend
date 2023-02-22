export interface UserI{
    id:number | null,
    nombre:String,
    email:String,
    password:String,
    estado:Boolean
}

//Las entidades seran tablas y cada propiedad sera una columna dentro de ellas
import { Entity,Column,PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,BaseEntity} from "typeorm";

@Entity("usuarios")//Nombre de la tabla
class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    declare id:number

    @Column()
    declare name:string

    @Column()
    declare email:string

    @Column()
    declare password:string

    @Column({
        default:true
    })
    declare state:boolean

    @CreateDateColumn()
    declare createdAt:Date;

    @UpdateDateColumn()
    declare updatedAt:Date;

}


export default User;
