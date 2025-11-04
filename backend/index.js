// server.js
import express from "express";
import cors from "cors";


import moveRoute from "./routes/moveRoute.js";

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());

app.use("/api", moveRoute);

// app.post("/makeMove", async (req, res) => {
//   const { boardView, currentPlayer, name } = req.body;

//   console.log(name);

//   try {
//     const response = await groq.chat.completions.create({
//       model: models.get(name),
//       temperature: 1,
//       messages: [
//         {
//           role: "system",
//           content: `You are a Tic Tac Toe player and your task is to predict the next best move.
// You will be given:
// 1. The current board state.
// 2. Your symbol ('X' or 'O').

// Output ONLY a number between 0 and 8 that represents the board cell where you want to place your symbol. If the place is already occupied then, choose another place. If a board cell is already occupied then you must not choose that cell.`,
//         },
//         {
//           role: "user",
//           content: `Current board state: ${boardView}\nYour symbol: ${currentPlayer}\nOutput a number between 0–8.`,
//         },
//       ],
//       response_format: {
//         type: "json_schema",
//         json_schema: {
//           name: "TicTacToeMove",
//           schema: {
//             type: "object",
//             properties: {
//               move: { type: "number", minimum: 0, maximum: 8 },
//             },
//             required: ["move"],
//             additionalProperties: false,
//           },
//         },
//       },
//     });

//     const jsonContent = JSON.parse(response.choices[0].message.content || "{}");

//     console.log("Groq structured response:", jsonContent);

//     res.json({ move: jsonContent.move });
//   } catch (error) {
//     console.error("Error calling Groq:", error);
//     res.status(500).json({ error: "Failed to fetch move from Groq" });
//   }
// });

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);

export const aiplaystictactoe = app;
