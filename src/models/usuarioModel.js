import { DataTypes } from "sequelize";
import { conn } from "../config/sequelize.js";

const usuarioModel = conn.define(
    "usuarios",
    {
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        nome:{
            type: DataTypes.STRING,
            allowNull: false
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        senha:{
            type: DataTypes.STRING,
            allowNull: false
        },
        telefone:{
            type: DataTypes.STRING,
            allowNull: false
        },
        endereco:{
            type: DataTypes.STRING,
            allowNull: false
        },
        tipoUsuario:{
            type: DataTypes.ENUM("comum", "admin"),
            allowNull: false
        },
        ativo:{
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
    },
    {
        timestamps: true,
        tableName: "usuarios",
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)

export default usuarioModel