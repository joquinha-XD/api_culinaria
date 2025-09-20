import { DataTypes } from "sequelize";
import { conn } from "../config/sequelize.js"

const receitaModel = conn.define(
    "receitas",
    {
        "id": {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        "titulo": {
            type: DataTypes.STRING,
            allowNull: false
        },
        "descricao": {
            type: DataTypes.STRING,
            allowNull: false
        },
        "ingredientes": {
            type: DataTypes.TEXT,
            allowNull: false
        },
        "modoPreparo": {
            type: DataTypes.TEXT,
            allowNull: false
        },
        "tempoPreparo": {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        "porcoes": {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        "dificuldade": {
            type: DataTypes.STRING,
            allowNull: false
        },
        imagemPrato:{
            type: DataTypes.STRING,
            defaultValue: "filename"
        },

        imagemUrl:{
            type: DataTypes.STRING,
            defaultValue: "caminhoDaImagem"
        }
        
    },
    {
        timestamps: true,
        tableName: "receitas",
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)

export default receitaModel