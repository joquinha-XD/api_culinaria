import { DataTypes } from "sequelize";
import { conn } from "../config/sequelize.js"
import usuarioModel from "./usuarioModel.js";
import receitaModel from "./receitaModels.js";

const favoritoModel = conn.define(
    "favoritos",
    {
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        usuarioId:{
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: usuarioModel,
                key: usuarioModel.id
            }
            
        },
        receitaId:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: receitaModel,
                key: receitaModel.id
            }
        },

        dataAdicionada:{
            type: DataTypes.DATE,
            allowNull: false
        },

        categoria:{
            type: DataTypes.STRING,
            allowNull: false
        },

        observacoes:{
            type: DataTypes.STRING,
            allowNull: false
        },

        prioridade:{
             type: DataTypes.ENUM("baixa", "media", "alta")
        },

        tentativasPreparo:{
            type: DataTypes.INTEGER,
            allowNull:false
        }
    },
    {
          timestamps: true,
        tableName: "favoritos",
        createdAt: "created_at",
        updatedAt: "updated_at"
    }

)
usuarioModel.hasMany(favoritoModel, {foreignKey: "usuarioId"})
favoritoModel.belongsTo(usuarioModel, {foreignKey: "usuarioId"})

receitaModel.hasMany(favoritoModel, {foreignKey: "receitaId"})
favoritoModel.belongsTo(receitaModel, {foreignKey: "receitaId"})

export default favoritoModel
