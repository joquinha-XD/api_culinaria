import { conn } from "../config/sequelize.js";
import { DataTypes } from "sequelize";
import usuarioModel from "./usuarioModel.js";
import receitaModel from "./receitaModels.js";

const curtidaModel = conn.define(
  "curtidas",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    receitaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "curtidas",
    createdAt: "created_at",
    updatedAt: false, 
  }
);

usuarioModel.hasMany(curtidaModel, { foreignKey: "usuarioId", as: "curtidas" });
curtidaModel.belongsTo(usuarioModel, { foreignKey: "usuarioId", as: "usuario" });

receitaModel.hasMany(curtidaModel, { foreignKey: "receitaId", as: "curtidasReceita" });
curtidaModel.belongsTo(receitaModel, { foreignKey: "receitaId", as: "receita" });

export default curtidaModel;