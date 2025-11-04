import { modelConfig } from "../services/common.js";

export default async function moveController(req, res) {
  const { boardView, currentPlayer, name } = req.body;

  try {
    const model = modelConfig.get(name);
    const result = await model.modelInstance.callModel(boardView, currentPlayer);

    res.json(result);
  } catch (error) {
    console.error(`Err while making move, model ${name}:`, error);
    res.status(500).json({ error: "Failed to get next move" });
  }
}
