import {chefModel} from "../models/associations.js";

export const buscarTodosChefs = async (request, response) => {
    try {
        const chefs = await chefModel.findAll()

        response.status(200).json(chefs)
    } catch (error) {
            console.log(error)
        response.status(500).json({mensagem: "Erro interno ao listar chefs"})
    }
}

export const cadastrarChef = async (request, response) => {
    const {nome, biografia, especialidade, experiencia, nacionalidade } = request.body

    if(!nome){
        response.status(400).json({
            erro: "Campo nome inválido",
            mensagem: "O campo nome não pode ser nulo"
        })
        return
    }
    if(!biografia){
         response.status(400).json({
            erro: "Campo biografia inválido",
            mensagem: "O campo biografia não pode ser nulo"
        })
        return
    }
    if(!especialidade){
         response.status(400).json({
            erro: "Campo especialidade inválido",
            mensagem: "O campo especialidade não pode ser nulo"
        })
        return
    }
    if(!experiencia){
         response.status(400).json({
            erro: "Campo experiencia inválido",
            mensagem: "O campo experiencia não pode ser nulo"
        })
        return
    }
    if(!nacionalidade){
         response.status(400).json({
            erro: "Campo nacionalidade inválido",
            mensagem: "O campo nacionalidade não pode ser nulo"
        })
        return
    }
    const novoChef = {
        nome,
        biografia,
        especialidade,
        experiencia,
        nacionalidade
    }
    try {
        const Chefnovo = await chefModel.create(novoChef)
        
        response.status(201).json({
            mensagem: "Chef cadastrado com sucesso",
            Chefnovo
        })
    } catch (error) {
        console.log(error)
        response.status(500).json({
            erro: "Erro interno ao cadastrar um chef",
            error
        })
    }
}

export const buscarChef = async (request, response) => {
    const {id} = request.params

    if(!id){
        res.status(400).json({
            erro: "Parâmetro id inválido",
            mensagem: "Parâmetro id necessário para buscar um chef"
        })
        return
    }

    try {
        const chefSelecionado = await chefModel.findByPk(id)
        if(!chefSelecionado){
            response.status(404).json({
                erro: "Id inválido",
                mensagem: "Nenhum chef com esse id foi encontrado"
            })
            return
        }

        response.status(200).json(chefSelecionado)
    } catch (error) {
            console.log(error)
        response.status(500).json({mensagem: "Erro interno ao listar servidor"})
    }
}

export const atualizarChef = async (request, response) => {
    const { id } = request.params
    const {nome, biografia, especialidade, experiencia} = request.body

    if(!id){
        res.status(400).json({
            erro: "Parâmetro id inválido",
            mensagem: "Parâmetro id necessário para atualizar um chef"
        })
        return
    }
    if(!nome){
        res.status(400).json({
            erro:"Campo invalido",
            mensagem: "O campo nome não pode ser nulo"
        })
        return
    }
    if(!biografia){
        res.status(400).json({
             erro:"Campo invalido",
            mensagem: "O campo biografia não pode ser nulo"
        })
        return
    }
    if(!especialidade){
        res.status(400).json({
             erro:"Campo invalido",
            mensagem: "O campo especialidade não pode ser nulo"
        })
        return
    }
    if(!experiencia){
        res.status(400).json({
             erro:"Campo invalido",
            mensagem: "O campo experiencia não pode ser nulo"
        })
        return
    }

    try {
        const chefSelecionado = await chefModel.findByPk(id)

        if(!chefSelecionado){
            res.status(404).json({
                erro: "Id inválido",
                mensagem: "Nenhum chef com esse id foi encontrado na base de dados"
            })
            return
        }

        if(nome !== undefined){
            chefSelecionado.nome = nome
        }

          if(biografia !== undefined){
            chefSelecionado.biografia = biografia
        }

          if(especialidade !== undefined){
            chefSelecionado.especialidade = especialidade
        }

          if(experiencia !== undefined){
            chefSelecionado.experiencia = experiencia
        }

        await chefSelecionado.save()
        response.status(200).json(chefSelecionado)
    } catch (error) {
            console.log(error)
        response.status(500).json({
            mensagem: "Erro interno ao atualizar um chef"
        })
    }
}

export const deletarChef = async (req, res) => {
    const { id } = req.params

    if(!id){
        res.status(400).json({
            erro: "Parâmetro id inválido",
            mensagem: "Parâmetro id necessário para deletar um chef"
        })
        return
    }

    try {
        const chefSelecionado = await chefModel.findByPk(id)
        if(!chefSelecionado){
            res.status(404).json({
                erro: "Id inválido",
                mensagem: "Nenhum chef com esse id foi encontrado na base de dados"
            })
            return
        }

        await chefModel.destroy({
            where: {id: chefSelecionado.id}
        })

        res.status(200).send()
    } catch (error) {
            console.log(error)
        res.status(500).json({
            erro: "Erro interno ao deletar um chef"
        })
    }
}