import multer from "multer";
import {imageStorage} from "../config/multer.js"

export const imageUpload = multer({
    storage: imageStorage,
    fileFilter: (req, file, cb) => {
        if(!file.originalname.match(/\.(png|jpg|jpeg|webp)$/i)){
            return cb(new Error("Por favor, envie apenas png,jpg,jpeg,webp"))
        }
        cb(null, true)
    }
})
