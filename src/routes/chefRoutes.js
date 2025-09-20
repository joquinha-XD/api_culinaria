import { Router } from "express"


import {buscarTodosChefs, cadastrarChef,buscarChef, atualizarChef, deletarChef} from "../controllers/chefController.js"

const router = Router()

router.post("/", cadastrarChef)

router.get("/", buscarTodosChefs )

router.get("/:id", buscarChef )

router.put("/:id", atualizarChef )

router.delete("/:id", deletarChef)

export default router;