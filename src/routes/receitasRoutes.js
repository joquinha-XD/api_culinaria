import { Router } from "express"

import { imageUpload } from "../middleware/imageUpload.js"
import { cadastrarReceitas, buscarReceitas, buscarReceita, atualizarReceita, deletarReceita, cadastrarFotoReceita, buscarImagemCapa, deletarImagemCapa, buscarReceitaChef  } from "../controllers/receitaController.js"

const router = Router()

router.post("/", cadastrarReceitas)
router.get("/", buscarReceitas)
router.get("/:id", buscarReceita)
router.get("/chef/:id", buscarReceitaChef)
router.put("/:id", atualizarReceita)
router.delete("/:id", deletarReceita)

//rotas imagem

router.post("/:id/imagem", imageUpload.single("imagem"), cadastrarFotoReceita)
router.get("/uploads/receitas/:filename", buscarImagemCapa )
router.delete("/:id/imagem", deletarImagemCapa)

export default router;