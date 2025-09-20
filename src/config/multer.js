import multer from "multer";
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//ONDE eu vou guardar as imagens
export const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = ""

        if(req.baseUrl.includes("receitas")){
            folder = 'receita'
        }

        cb(null, path.join(__dirname, `../../public/${folder}`))
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9)
        const fileExtension = path.extname(file.originalname)

        cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension)
    }
})