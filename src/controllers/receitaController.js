import { chefModel, receitaModel } from "../models/associations.js";

import path from "node:path"
import { fileURLToPath } from "node:url"
import { existsSync, unlinkSync } from "node:fs";

import { identificarDiretorioImagem } from "../helpers/localizarDiretorio.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const cadastrarReceitas = async (request, response) => {
  const {
    titulo, descricao, ingredientes, modoPreparo, tempoPreparo, porcoes, dificuldade, chefs
  } = request.body

  //validações 
  if (!titulo) {
    response.status(400).json({
      erro: "Campo titulo inválido",
      mensagem: "O campo titulo não pode ser nulo"
    })
    return
  }
  if (!descricao) {
    response.status(400).json({
      erro: "Campo descricao inválido",
      mensagem: "O campo descricao não pode ser nulo"
    })
    return
  }
  if (!ingredientes) {
    response.status(400).json({
      erro: "Campo ingredientes inválido",
      mensagem: "O campo ingredientes não pode ser nulo"
    })
    return
  }
  if (!modoPreparo) {
    response.status(400).json({
      erro: "Campo modoPreparo inválido",
      mensagem: "O campo modoPreparo não pode ser nulo"
    })
    return
  }
  if (!tempoPreparo) {
    response.status(400).json({
      erro: "Campo tempoPreparo inválido",
      mensagem: "O campo tempoPreparo não pode ser nulo"
    })
    return
  }
  if (!porcoes) {
    response.status(400).json({
      erro: "Campo porcoes inválido",
      mensagem: "O campo porcoes não pode ser nulo"
    })
    return
  }
  if (!dificuldade) {
    response.status(400).json({
      erro: "Campo dificuldade inválido",
      mensagem: "O campo dificuldade não pode ser nulo"
    })
    return
  }
  if (!Array.isArray(chefs) || chefs.length === 0) {
    response.status(400).json({
      erro: 'Campo inválido',
      mensagem: "Campo chefs não pode ser nulo e deve conter pelo menos 1 chef"
    })
    return
  }

  try {
    const chefsEncontrados = await chefModel.findAll({
      where: {
        id: chefs
      }
    })
    console.log(chefsEncontrados)

    if (chefsEncontrados.length !== chefs.length) {
      response.status(404).json({
        erro: "id invalido",
        mensagem: "Um ou mais id de chefs são invalidos ou nao existe"
      })
      return
    }

    const receita = await receitaModel.create({
      titulo, descricao, ingredientes, modoPreparo, tempoPreparo, porcoes, dificuldade
    })

    await receita.addChefs(chefs)

    const receitasComChef = await receitaModel.findByPk(receita.id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: {
        model: chefModel,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        through: { attributes: [] }
      }
    })

    response.status(201).json({ mensagem: 'Receita cadastrada', receitasComChef })
  } catch (error) {
    console.log(error)
    response.status(200).json({ mensagem: "Erro interno ao cadastrar receitas" })
  }
}

export const buscarReceitas = async (request, response) => {
  const page = parseInt(request.query.page) || 1;
  const limit = parseInt(request.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const receitas = await receitaModel.findAndCountAll({
      include: {
        model: chefModel,
        through: { attributes: [] }
      },
      offset,
      limit
    })

    //teste de integração receitas-chef 
    const receitasFormatadas = receitas.rows.map((receita) => {
      return {
        id: receita.id,
        titulo: receita.titulo,
        descricao: receita.descricao,
        ingredientes: receita.ingredientes,
        modoPreparo: receita.modoPreparo,
        tempoPreparo: receita.tempoPreparo,
        porcoes: receita.porcoes,
        dificuldade: receita.dificuldade,
        chef: receita.chefs.map((chef) => ({
          id: chef.id,
          nome: chef.nome
        }))
      }
    })

    console.log(receitasFormatadas)
    response.status(200).json(receitasFormatadas)
  } catch (error) {
    console.log(error)
    response.status(400).json({ mensagem: "Erro interno ao listar receitas" })
  }
}

export const buscarReceita = async (request, response) => {
  const { id } = request.params

  if (!id) {
    response.status(400).json({
      erro: "Parâmetro ID incorreto",
      mensagem: "O id não pode ser nulo",
    });
    return;
  }

  try {
    const receita = await receitaModel.findByPk(id)

    if (!receita) {
      response.status(200).json({ mensagem: "receita não existe" })
      return
    }
    response.status(200).json(receita)
  } catch (error) {
    console.log(error)
    response.status(500).json({ mensagem: "Erro interno ao buscar receita" })
  }
}

export const buscarReceitaChef = async (request, response) => {
  const { id } = request.params

  if (!id) {
    response.status(400).json({ mensagem: "O parâmetro ID do chef não pode ser nulo" })
    return
  }

  try {
    const todasReceitas = await receitaModel.findAndCountAll({
      include: {
        model: chefModel,
        through: { attributes: [] }
      }
    })

    const receitasComChef = []

    const receitasPorIdChef = todasReceitas.rows.map((receita) => {
      let idChef = receita.chefs.map((chef) => chef.id)
      if(idChef.toString() === id){
        const rFormatada = {
          id: receita.id,
          titulo: receita.titulo,
          descricao: receita.descricao,
          ingredientes: receita.ingredientes,
          modoPreparo: receita.modoPreparo,
          tempoPreparo: receita.tempoPreparo,
          porcoes: receita.porcoes,
          dificuldade: receita.dificuldade,
          nomeChef: receita.chefs.map((chef) => chef.nome)
        }
        receitasComChef.push(rFormatada)
      }
    })

    response.status(200).json(receitasComChef)

    
  } catch (error) {
    console.log(error)
    response.status(500).json({ mensagem: "Erro interno ao buscar receita pelo ID do chef" })
  }
}

export const atualizarReceita = async (request, response) => {
  const { id } = request.params
  const { titulo, descricao, ingredientes, modoPreparo, tempoPreparo, porcoes, dificuldade, chefs } = request.body

  try {
    const receitaSelecionada = await receitaModel.findOne({
      where: { id },
    })

    if (!titulo) {

    }
    if (!descricao !== undefined) {
      receitaSelecionada.descricao = descricao
    }
    if (!ingredientes !== undefined) {
      receitaSelecionada.ingredientes = ingredientes
    }
    if (!modoPreparo !== undefined) {
      receitaSelecionada.modoPreparo = modoPreparo
    }
    if (!tempoPreparo !== undefined) {
      receitaSelecionada.tempoPreparo = tempoPreparo
    }
    if (!porcoes !== undefined) {
      receitaSelecionada.porcoes = porcoes
    }
    if (!dificuldade !== undefined) {
      receitaSelecionada.dificuldade = dificuldade
    }

    await receitaSelecionada.save()
    response.status(200).json({ mensagem: "Receita atualizada com sucesso", receitaSelecionada })
  } catch (error) {
    console.log(error)
    response.status(500).json({ Mensagem: "Erro interno ao listar receita" })
  }
}

export const deletarReceita = async (request, response) => {
  const { id } = request.params;

  if (!id) {
    response.status(400).json({
      erro: "Parâmetro ID incorreto",
      mensagem: "O id não pode ser nulo",
    });
    return;
  }

  try {

    const deleterReceita = await receitaModel.destroy({
      where: { id }
    });

    if (deleterReceita === 0) {
      response.status(404).json({ mensagem: "receita não encontrado" })
      return
    }

    response.status(204).send()

  } catch (error) {
    console.log(error)
    response.status(500).json({ mensagem: " Erro interno ao deletar um receita" })
  }
}

export const cadastrarFotoReceita = async (req, res) => {
  const { id } = req.params;
  const { filename, path } = req.file;

  if (!id) {
    res.status(400).json({ mensagem: "O Id é obrigatório" });
    return;
  }

  try {
    const receita = await receitaModel.findByPk(id);

    if (!receita) {
      res.status(404).json({ mensagem: "Receita não existe" });
      return;
    }

    const caminhoImagem = identificarDiretorioImagem(receita.imagemPrato)

    if(receita.imagemPrato !== "imagemPrato") {
      unlinkSync(caminhoImagem)
    }

    receita.imagemPrato = filename;
    receita.imagemUrl = path;

    await receita.save();

    res.status(200).json({ mensagem: "Capa cadastrada", receita });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensagem: "Erro interno ao cadastrar capa" });
  }
};

export const buscarImagemCapa = async (req, res) => {
  const { filename } = req.params

  if (!filename) {
    res.status(400).json({ mensagem: "Parâmetro filename é obrigatório" })
    return
  }

  try {
    const receita = await receitaModel.findOne({
      where: {
        imagemPrato: filename
      }
    })

    if (!receita) {
      res.status(404).json({ mensagem: "receita não encontrado" })
      return
    }

    const caminhoImagem = path.join(__dirname, "../../public/receita", filename)

    res.status(200).sendFile(caminhoImagem)
  } catch (error) {
    console.log(error)
    res.status(500).json({ mensagem: "Erro interno ao buscar capa do receita" })
  }
}

export const deletarImagemCapa = async (req, res) => {
  const { id } = req.params

  if (!id) {
    res.status(400).json({ mensagem: "O ID é obrigatório" })
    return
  }

  try {
    const receita = await receitaModel.findByPk(id)

    if (!receita) {
      res.status(404).json({ mensagem: "receita não encontrado" })
      return
    }

    if(receita.imagemPrato === "imagemPrato") {
      res.status(400).json({ mensagem: "Esse receita não possui capa" })
      return
    }

    const caminhoImagem = identificarDiretorioImagem(receita.imagemPrato)

    if (!existsSync(caminhoImagem)) {
      res.status(404).json({ mensagem: "Esse receita não possui uma capa" })
    }

    if(existsSync(caminhoImagem)) {
      unlinkSync(caminhoImagem)
    }

    receita.imagemPrato = "imagemPrato"
    receita.imagemUrl = "caminhoDaImagem"

    await receita.save()

    console.log(receita.imagemPrato)

    res.status(200).json({ mensagem: "Capa do receita removida" })

  } catch (error) {
    console.log(error)
    res.status(500).json({ mensagem: "Erro interno ao deletar capa do receita" })
  }
}