import { Router } from "express"
import { cadastrarFavorita, listarFavoritasUsuario, removerFavorita, listarTodasFavoritas, detalhesFavorita} from "../controllers/favoritosController.js"

const router = Router()

router.post("/", cadastrarFavorita)
router.get("/", listarFavoritasUsuario)
router.get("/:id", detalhesFavorita)
router.get("/", listarTodasFavoritas)
router.delete("/:id", removerFavorita)

export default router