import curtidaModel from "../models/curtidaModel.js";
import receitaModel from "../models/receitaModels.js";


export const curtirReceita = async (request, response) => {
  const { id: receitaId } = request.params;
  const { usuarioId } = request.body;

  try {
    const existe = await curtidaModel.findOne({ where: { usuarioId, receitaId } });
    if(existe){
      response.status(400).json({ mensagem: "Receita já curtida" })
      return
    }

    const curtida = await curtidaModel.create({ usuarioId, receitaId });
    response.status(201).json(curtida);
  } catch (error) {
    console.error(error);
    response.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const listarCurtidasUsuario = async (request, response) => {  
  const { usuarioId } = request.body;

  try {
    const curtidas = await curtidaModel.findAll({
      where: { usuarioId },
      includes: [{ model: receitaModel }]
    });

    response.status(200).json(curtidas);
  } catch (error) {
    console.error(error);
    response.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const descurtirReceita = async (request, response) => {
  const { id: receitaId } = request.params;
  const usuarioId = request.user.id;

  try {
    const curtida = await curtidaModel.findOne({ where: { usuarioId, receitaId } });
    if (!curtida) return response.status(404).json({ mensagem: "Curtida não encontrada" });

    await curtida.destroy();
    response.status(204).send();
  } catch (error) {
    console.error(error);
    response.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};
