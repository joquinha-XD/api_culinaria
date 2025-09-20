import favoritoModel from "../models/favoritosModel.js";
import receitaModel from "../models/receitaModels.js";
import usuarioModel from "../models/usuarioModel.js";

export const cadastrarFavorita = async (request, response) => {
  const { usuarioId, receitaId, dataAdicionada, categoria, observacoes, prioridade, tentativasPreparo } = request.body

  if (!usuarioId) {
    response.status(400).json({ mensagem: "Campo usuario id nao pode ser nulo" })
    return
  }

  if (!receitaId) {
    response.status(400).json({ mensagem: "Campo receita id nao pode ser nulo" })
    return
  }

  if (!dataAdicionada) {
    response.status(400).json({ mensagem: "Campo data adicionada nao pode ser nulo" })
    return
  }

  if (!categoria) {
    response.status(400).json({ mensagem: "Campo categoria nao pode ser nulo" })
    return
  }

  if (!observacoes) {
    response.status(400).json({ mensagem: "Campo observacoes nao pode ser nulo" })
    return
  }

  if (!prioridade) {
    response.status(400).json({ mensagem: "Campo prioridade nao pode ser nulo" })
    return
  }

  if (!tentativasPreparo) {
    response.status(400).json({ mensagem: "Campo tentativas preparo nao pode ser nulo" })
    return
  }

  const novafavorita = {
    usuarioId,
    receitaId,
    dataAdicionada,
    categoria,
    observacoes,
    prioridade,
    tentativasPreparo
  }
  try {
    const usuario = await usuarioModel.findOne({
      where: {
        id: usuarioId
      }
    })

    if (!usuario) {
      response.status(404).json({ mensagem: "Esse usuário não existe" })
      return
    }

    const receita = await receitaModel.findOne({
      where: {
        id: receitaId
      }
    })

    if (!receita) {
      response.status(404).json({ mensagem: "Essa receita não existe" })
      return
    }

    const newfav = await favoritoModel.create(novafavorita)
    response.status(201).json({ mensagem: "receita favoritada com sucesso", newfav })
  } catch (error) {
    console.log(error)
    response.status(500).json({ mensagem: "erro interno ao favoritar receita" })
  }

}

export const removerFavorita = async (request, response) => {
  const { id } = request.params;

  try {
    const favorita = await favoritoModel.findOne({ where: { id } });
    if(!favorita){
      response.status(404).json({ mensagem: "Favorita não encontrada" })
      return
    }

    await favorita.destroy();
    response.status(204).send();
  } catch (error) {
    console.error(error);
    response.status(500).json({ mensagem: "Erro interno ao deletar favorita" });
  }
};

export const listarFavoritasUsuario = async (request, response) => {
  const { usuarioId } = request.body;

  try {
    const favoritas = await favoritoModel.findAll({
      where: { usuarioId },
      include: [{ model: receitaModel }]
    });

    response.status(200).json(favoritas);
  } catch (error) {
    console.error(error);
    response.status(500).json({ mensagem: "Erro interno do servidor"});
  }
};

export const detalhesFavorita = async (request, response) => {
  const { id } = request.params;
  const { usuarioId } = request.body;

  try {
    const favorita = await favoritoModel.findOne({
      where: { id, usuarioId },
      include: [{
        model: receitaModel
      }]
    });

    if (!favorita) {
      response.status(404).json({ mensagem: "Favorita não encontrada" });
      return
    }

    const receitaFavoritaFormatada = {
      id: favorita.receita.id,
      titulo: favorita.receita.titulo,
      descricao: favorita.receita.descricao,
      ingredientes: favorita.receita.ingredientes,
      modoPreparo: favorita.receita.modoPreparo,
      tempoPreparo: favorita.receita.tempoPreparo,
      porcoes: favorita.receita.porcoes,
      dificuldade: favorita.receita.dificuldade
    }


    response.status(200).json(receitaFavoritaFormatada);
  } catch (error) {
    console.error(error);
    response.status(500).json({ mensagem: "Erro interno ao buscar os detalhes da receita favoritada" });
  }
};

export const listarTodasFavoritas = async (request, response) => {
  const { usuarioId } = request.body

  if (!usuarioId) {
    response.status(400).json({ mensagem: "Campo usuarioID não pode ser nulo" })
    return
  }

  try {
    const usuario = await usuarioModel.findByPk({
      id: usuarioId
    })

    if (usuario.tipoUsuario !== "admin") {
      response.status(403).json({ mensagem: "Você não tem permissão de listar todas as favoritas" })
      return
    }

    const favoritas = await favoritoModel.findAll({ include: [{ model: receitaModel }] });
    response.status(200).json(favoritas);
  } catch (error) {
    console.error(error);
    response.status(500).json({ mensagem: "Erro interno ao listar receitas favoritas" });
  }
};