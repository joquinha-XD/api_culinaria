import { Router } from "express";
import { logarUsuario } from "../controllers/usuarioController.js";

const router = Router()

router.post("/login", logarUsuario)

export default router;