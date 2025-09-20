import { DataTypes } from "sequelize";
import { conn } from "../config/sequelize.js"
import usuarioModel from "./usuarioModel.js";
import receitaModel from "./receitaModels.js";

const comentarioModel = conn.define("Comentario", {
  texto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avaliacao: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  aprovado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: "comentarios",
  timestamps: true
});

comentarioModel.belongsTo(usuarioModel, { foreignKey: "usuarioId", as: "usuario" });
comentarioModel.belongsTo(receitaModel, { foreignKey: "receitaId", as: "receita" });

export default comentarioModel;
