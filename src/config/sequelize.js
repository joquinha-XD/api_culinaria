import { Sequelize } from "sequelize";

export const conn = new Sequelize('Receitas', 'root', '123456789', {
    dialect: "sqlite",
    storage: "database.sqlite"
})