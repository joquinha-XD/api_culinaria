import jwt from "jsonwebtoken"

const senhaToken = "SENHATOKEN123"

const createUserToken = async (usuario, req, res) => {
    const token = jwt.sign(
        {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        },
        senhaToken,
        {
            expiresIn: "12h"
        }
    )
    res.status(200).json({
        success: true,
        data: {
            user: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipoUsuario: usuario.tipoUsuario
            }
        },
        accessToken: token,
        expiresIn: 12

        
    })
}

export default createUserToken;