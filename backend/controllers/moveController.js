import { groq, models, systemPrompt } from "../services/common.js";


export default async function moveController(req, res) {
  const { boardView, currentPlayer, name } = req.body;

  console.log(name);

  try {
    const response = await groq.chat.completions.create({
      model: models.get(name),
      temperature: 1,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Current board state: ${boardView}\nYour symbol: ${currentPlayer}\nOutput a number between 0–8.`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "TicTacToeMove",
          schema: {
            type: "object",
            properties: {
              move: { type: "number", minimum: 0, maximum: 8 },
            },
            required: ["move"],
            additionalProperties: false,
          },
        },
      },
    });

    const jsonContent = JSON.parse(response.choices[0].message.content || "{}");

    console.log("Groq structured response:", jsonContent);

    res.json({ move: jsonContent.move });
  } catch (error) {
    console.error("Error calling Groq:", error);
    res.status(500).json({ error: "Failed to fetch move from Groq" });
  }
}
