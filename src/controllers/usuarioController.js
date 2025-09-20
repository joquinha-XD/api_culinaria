import usuarioModel from "../models/usuarioModel.js"
import bcrypt from "bcryptjs"
import createUserToken from "../helpers/create-user-token.js"


export const cadastrarUsuario = async (request, response) => {
    const { nome, email, senha, telefone, endereco, tipoUsuario, ativo } = request.body

    if (!nome) {
        response.status(400).json({ mensgem: "Campo nome não pode ser nulo" })
        return
    }

    if (!email) {
        response.status(400).json({ mensgem: "Campo email não pode ser nulo" })
        return
    }

    if (!senha) {
        response.status(400).json({ mensgem: "Campo senha não pode ser nulo" })
        return
    }

    if (!telefone) {
        response.status(400).json({ mensgem: "Campo telefone não pode ser nulo" })
        return
    }

    if (!endereco) {
        response.status(400).json({ mensgem: "Campo endereco não pode ser nulo" })
        return
    }

    if (!tipoUsuario) {
        response.status(400).json({ mensgem: "Campo tipo usuario não pode ser nulo" })
        return
    }

    if (!ativo) {
        response.status(400).json({ mensgem: "Campo ativo não pode ser nulo" })
        return
    }

    const salt = bcrypt.genSaltSync(12)
    const senhaCrypto = bcrypt.hashSync(senha, salt)

    const usuario = {
        nome,
        email,
        senha: senhaCrypto,
        telefone,
        endereco,
        tipoUsuario,
        ativo
    }

    try {
        const novoUsuario = await usuarioModel.create(usuario)
        response.status(200).json({ mensagem: "Usuario cadastrado com sucesso", novoUsuario })
    } catch (error) {
        console.log(error)
        response.status(500).json({ mensagem: "erro internal error" })
    }
}

export const buscarUsuarios = async (request, response) => {
    try {
        const usuarios = await usuarioModel.findAll()

        const usuariosFormatados = usuarios.map((usuario) => {
            return {
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone,
                ativo: usuario.ativo,
                senha: usuario.senha
            }
        })

        response.status(200).json(usuariosFormatados)
    } catch (error) {
        console.log(error)
        response.status(500).json({ mensagem: "erro internno ao buscar usuarios" })
    }
}

export const atualizarUsuario = async (request, response) => {
    const { id } = request.params
    const { nome, email, senha, telefone, endereco } = request.body

    if (!id) {
        response.status(400).json({ mensagem: "Parâmetro ID não pode ser nulo" })
        return
    }

    try {
        const usuario = await usuarioModel.findByPk(id)

        if (!usuario) {
            response.status(404).json({ mensagem: "Usuário não encontrado" })
            return
        }

        if (nome !== undefined) {
            usuario.nome = nome
        }
        if (email !== undefined) {
            usuario.email = email
        }
        if (senha !== undefined) {
            const salt = bcrypt.genSaltSync(12)
            const senhaCrypto = bcrypt.hashSync(senha, salt)

            usuario.senha = senhaCrypto
        }
        if (telefone !== undefined) {
            usuario.telefone = telefone
        }
        if (endereco !== undefined) {
            usuario.endereco = endereco
        }

        await usuario.save()

        response.status(200).json({mensagem: "Usuário atualizado", usuario})
    } catch (error) {
        console.log(error)
        response.status(500).json({mensagem: "Erro interno ao atualizar usuário"})
    }
}

export const buscarUmUsuario = async (request, response) => {
    const { id } = request.params

    if(!id){
        response.status(400).json({mensagem: "Parâmetro ID não pode ser nulo"})
        return
    }

    try {
        const usuario = await usuarioModel.findByPk(id)

        if(!usuario){
            response.status(404).json({mensagem: "Usuário não existe"})
            return
        }

        const usuarioFormatado = {
            nome: usuario.nome,
            email: usuario.email,
            telefone: usuario.telefone,
            ativo: usuario.ativo
        }
        
        response.status(200).json(usuarioFormatado)
    } catch (error) {
        console.log(error)
        response.status(500).json({mensagem: "Erro interno ao buscar usuário"})
    }
}

export const logarUsuario = async (request, response) => {
    const { email, senha} = request.body

        if(!email){
        response.status(400).json({mensagem: "Email não pode ser nulo"})
        return
    }

    if(!senha){
        response.status(400).json({mensagem: "Senha não pode ser nulo"})
        return
    }

    try {
        const usuario = await usuarioModel.findOne({
            where: {email}
        })

        if(!usuario){
            response.status(404).json({mensagem:"Email não está cadastrado"})
            return
        }

        const compararSenha = bcrypt.compareSync(senha, usuario.senha)
        if(!compararSenha){
            response.status(403).json({mensagem:"Senha incorreta"})
            return
        }

        await createUserToken(usuario, request, response)
    } catch (error) {
        console.log(error)
        response.status(500).json({mensagem:"erro interno ao fazer login"})
    }
}
