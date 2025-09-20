import express from "express";
import cors from "cors";
import { conn } from "./config/sequelize.js";

import path from "node:path"
import { fileURLToPath } from "node:url";

import "./models/associations.js"
//Rotas
import chefRoutes from "./routes/chefRoutes.js"
import receitasRoutes from "./routes/receitasRoutes.js"
import usuarioRoutes from "./routes/usuarioRoutes.js"
import logarUsuarioRoutes from "./routes/logarUsuarioRoutes.js"
import favoritosRoutes from "./routes/favoritosRoutes.js"
import curtidasRoutes from "./routes/curtidasRoutes.js"
import comentariosRoutes from "./routes/comentarioRoutes.js"
const PORT = 3333

const app = express();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)



app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/static', express.static('public'));

app.use("/public", express.static(path.join(__dirname, "../public")))
conn
    .sync()
    .then(() => console.log("Banco de dados conectado"))
    .catch((error) => console.log(error));

const logRoutes = (request, response, next) => {
  const { url, method } = request;
  const rota = `[${method.toUpperCase()}] - ${url}`;
  console.log(rota);
  next();
};

//middleware GLOBAL
app.use(logRoutes);

app.use("/api/chefs", chefRoutes)
app.use("/api/receitas", receitasRoutes, comentariosRoutes, curtidasRoutes)
app.use("/api/usuarios", usuarioRoutes, comentariosRoutes)
app.use("/api/usuario", curtidasRoutes)
app.use("/api/auth", logarUsuarioRoutes)
app.use("/api/favoritas", favoritosRoutes)
app.use("/api/admin/favoritas", favoritosRoutes)
app.use("/api/comentarios", comentariosRoutes); 

export default app;