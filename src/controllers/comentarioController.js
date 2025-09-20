import comentarioModel from "../models/comentarioModel.js";
import usuarioModel from "../models/usuarioModel.js";
import receitaModel from "../models/receitaModels.js";

export const cadastrarComentario = async (req, res) => {
  const { usuarioId, receitaId, texto, avaliacao } = req.body;

  if (!usuarioId) {
    res.status(400).json({ mensagem: "Campo usuarioId não pode ser nulo" });
    return;
  }

  if (!receitaId) {
    res.status(400).json({ mensagem: "Campo receitaId não pode ser nulo" });
    return;
  }

  if (!texto) {
    res.status(400).json({ mensagem: "Campo texto não pode ser nulo" });
    return;
  }

  if (!avaliacao) {
    res.status(400).json({ mensagem: "Campo avaliacao não pode ser nulo" });
    return;
  }

  if (avaliacao < 1 || avaliacao > 5) {
    res.status(400).json({ mensagem: "A avaliação deve estar entre 1 e 5 estrelas" });
    return;
  }

  try {
    const usuario = await usuarioModel.findOne({ where: { id: usuarioId } });
    if (!usuario) {
      res.status(404).json({ mensagem: "Esse usuário não existe" });
      return;
    }

    const receita = await receitaModel.findOne({ where: { id: receitaId } });
    if (!receita) {
      res.status(404).json({ mensagem: "Essa receita não existe" });
      return;
    }

    const novoComentario = await comentarioModel.create({
      usuarioId,
      receitaId,
      texto,
      avaliacao,
      aprovado: true
    });

    res.status(201).json({ mensagem: "Comentário adicionado com sucesso", data: novoComentario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno ao adicionar comentário" });
  }
};


export const listarComentariosReceita = async (req, res) => {
  const { id } = req.params; 
  try {
    const comentarios = await comentarioModel.findAll({
      where: { receitaId: id },
      include: [{ model: usuarioModel, attributes: ["id", "nome"] }]
    });

    res.status(200).json(comentarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno ao listar comentários" });
  }
};


export const editarComentario = async (req, res) => {
  const { id } = req.params;
  const { texto, avaliacao } = req.body;
  const usuarioId = req.user.id;

  try {
    const comentario = await comentarioModel.findOne({ where: { id, usuarioId } });
    if (!comentario) {
      res.status(404).json({ mensagem: "Comentário não encontrado ou não pertence ao usuário" });
      return;
    }

    if (avaliacao && (avaliacao < 1 || avaliacao > 5)) {
      res.status(400).json({ mensagem: "A avaliação deve estar entre 1 e 5 estrelas" });
      return;
    }

    comentario.texto = comentario.texto;
    comentario.avaliacao = comentario.avaliacao;
    await comentario.save();

    res.status(200).json({ mensagem: "Comentário atualizado com sucesso", data: comentario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno ao atualizar comentário" });
  }
};


export const removerComentario = async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.user.id;

  try {
    const comentario = await comentarioModel.findOne({ where: { id, usuarioId } });
    if (!comentario) {
      res.status(404).json({ mensagem: "Comentário não encontrado ou não pertence ao usuário" });
      return;
    }

    await comentario.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno ao remover comentário" });
  }
};


export const listarComentariosUsuario = async (req, res) => {
  const usuarioId = req.user.id;

  try {
    const comentarios = await comentarioModel.findAll({
      where: { usuarioId },
      include: [{ model: receitaModel, attributes: ["id", "titulo"] }]
    });

    res.status(200).json(comentarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno ao listar comentários do usuário" });
  }
};
