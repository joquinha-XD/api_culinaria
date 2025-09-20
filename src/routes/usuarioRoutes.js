import { Router } from "express";
import { cadastrarUsuario, buscarUsuarios, atualizarUsuario, buscarUmUsuario } from "../controllers/usuarioController.js";

const router = Router()

router.post("/", cadastrarUsuario)
router.get("/", buscarUsuarios)
router.put("/:id", atualizarUsuario)
router.get("/:id", buscarUmUsuario)


export default router;