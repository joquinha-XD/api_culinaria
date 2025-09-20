import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const identificarDiretorioImagem = (receita) => {
    const caminhoImagem = path.join(__dirname, "../../public/receita", receita)

    return caminhoImagem
}