import { Router } from "express"
import { cadastrarComentario, editarComentario, listarComentariosReceita, listarComentariosUsuario, removerComentario } from "../controllers/comentarioController.js"



const router = Router()

router.post("/:id/comentarios", cadastrarComentario)
router.get("/:id/comentarios", listarComentariosReceita )
router.put("/:id", editarComentario)
router.get("/:id", listarComentariosUsuario)
router.delete("/comentarios", removerComentario)

export default router