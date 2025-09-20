import curtidaModel from "../models/curtidaModel.js";
import receitaModel from "../models/receitaModels.js";


export const curtirReceita = async (req, res) => {
  const { id: receitaId } = req.params;
  const { usuarioId } = req.body;

  try {
    const existe = await curtidaModel.findOne({ where: { usuarioId, receitaId } });
    if(existe){
      res.status(400).json({ mensagem: "Receita já curtida" })
      return
    }

    const curtida = await curtidaModel.create({ usuarioId, receitaId });
    res.status(201).json(curtida);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const listarCurtidasUsuario = async (req, res) => {  
  const { usuarioId } = req.body;

  try {
    const curtidas = await curtidaModel.findAll({
      where: { usuarioId },
      includes: [{ model: receitaModel }]
    });

    res.status(200).json(curtidas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const descurtirReceita = async (req, res) => {
  const { id: receitaId } = req.params;
  const usuarioId = req.user.id;

  try {
    const curtida = await curtidaModel.findOne({ where: { usuarioId, receitaId } });
    if (!curtida) return res.status(404).json({ mensagem: "Curtida não encontrada" });

    await curtida.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};
