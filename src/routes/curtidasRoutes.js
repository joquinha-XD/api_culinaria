import { Router } from "express"
import { curtirReceita, listarCurtidasUsuario, descurtirReceita} from "../controllers/curtidasController.js"

const router = Router()

router.post("/:id/curtir", curtirReceita)
router.get("/curtidas", listarCurtidasUsuario )
router.delete("/:id/curtir", descurtirReceita)

export default router