import comentarioModel from "../models/comentarioModel.js";
import usuarioModel from "../models/usuarioModel.js";
import receitaModel from "../models/receitaModels.js";

export const cadastrarComentario = async (request, response) => {
  const { usuarioId, receitaId, texto, avaliacao } = request.body;

  if (!usuarioId) {
    response.status(400).json({ mensagem: "Campo usuarioId não pode ser nulo" });
    return;
  }

  if (!receitaId) {
    response.status(400).json({ mensagem: "Campo receitaId não pode ser nulo" });
    return;
  }

  if (!texto) {
    response.status(400).json({ mensagem: "Campo texto não pode ser nulo" });
    return;
  }

  if (!avaliacao) {
    response.status(400).json({ mensagem: "Campo avaliacao não pode ser nulo" });
    return;
  }

  if (avaliacao < 1 || avaliacao > 5) {
    response.status(400).json({ mensagem: "A avaliação deve estar entre 1 e 5 estrelas" });
    return;
  }

  try {
    const usuario = await usuarioModel.findOne({ where: { id: usuarioId } });
    if (!usuario) {
      response.status(404).json({ mensagem: "Esse usuário não existe" });
      return;
    }

    const receita = await receitaModel.findOne({ where: { id: receitaId } });
    if (!receita) {
      response.status(404).json({ mensagem: "Essa receita não existe" });
      return;
    }

    const comentario = {
      usuarioId,
      receitaId,
      texto,
      avaliacao,
      aprovado: true
    }

    const novoComentario = await comentarioModel.create(comentario);

    response.status(201).json({ mensagem: "Comentário adicionado com sucesso", novoComentario });
  } catch (error) {
    console.error(error);
    response.status(500).json({ mensagem: "Erro interno ao adicionar comentário" });
  }
};


export const listarComentariosReceita = async (request, response) => {
  const { id } = request.params;

  if(!id){
    response.status(400).json({mensagem: "Parâmetro ID não pode ser nulo"})
  }

  try {
    const comentarios = await comentarioModel.findAll({
      where: { receitaId: id },
      include: [{ model: usuarioModel, attributes: ["id", "nome"] }]

    });
    if(!comentarios){
      response.status(404).json({mensagem: "Essa receita não existe"})
      return
    }

    response.status(200).json(comentarios);
  } catch (error) {
    console.error(error);
    response.status(500).json({ mensagem: "Erro interno ao listar comentários" });
  }
};


export const editarComentario = async (request, response) => {
  const { id } = request.params;
  const { texto, avaliacao } = request.body;
  const { usuarioId } = request.body;

  if(!usuarioId){
    response.status(400).json({mensagem: "Campo usuarioId não pode ser nulo"})
    return
  }

  try {
    const comentario = await comentarioModel.findOne({ where: { id, usuarioId } });
    if (!comentario) {
      response.status(404).json({ mensagem: "Comentário não encontrado ou não pertence ao usuário" });
      return;
    }

    if(texto !== undefined){
      comentario.texto = texto
    }

    if(avaliacao !== undefined && (avaliacao < 1 || avaliacao > 5)) {
      comentario.avaliacao = avaliacao;
    } else {
      response.status(400).json({mensagem: "Avaliação deve estar entre 1 e 5 estrelas"})
      return
    }
    
    await comentario.save();

    response.status(200).json({ mensagem: "Comentário atualizado com sucesso", data: comentario });
  } catch (error) {
    console.error(error);
    response.status(500).json({ mensagem: "Erro interno ao atualizar comentário" });
  }
};


export const removerComentario = async (request, response) => {
  const { id } = request.params;
  const { usuarioId } = request.body;

  if(!id){
    response.status(400).json({mensagem: "Parâmetro ID não pode ser nulo"})
    return
  }

  if(!usuarioId){
    response.status(400).json({mensagem: "Campo usuarioId não pode ser nulo"})
    return
  }

  try {
    const comentario = await comentarioModel.findOne({ where: { id } });
    if (!comentario) {
      response.status(404).json({ mensagem: "Comentário não existe" });
      return
    }

    if(comentario.usuarioId !== usuarioId){
      response.status(403).json({mensagem: "Você não possui permissão para deletar esse comentário"})
      return
    }

    await comentario.destroy();
    response.status(204).send();
  } catch (error) {
    console.error(error);
    response.status(500).json({ mensagem: "Erro interno ao remover comentário" });
  }
};


export const listarComentariosUsuario = async (request, response) => {
  const { usuarioId } = request.body;

  if(!usuarioId){
    response.status(400).json({mensagem: "Campo usuarioId não pode ser nulo"})
    return
  }

  try {
    const comentarios = await comentarioModel.findAll({
      where: { usuarioId },
      include: [{ model: receitaModel, attributes: ["id", "titulo"] }]
    });

    if(!comentarios){
      response.status(404).json({mensagem: "Esse usuário não possui comentários"})
      return
    }

    response.status(200).json(comentarios);
  } catch (error) {
    console.error(error);
    response.status(500).json({ mensagem: "Erro interno ao listar comentários do usuário" });
  }
};
