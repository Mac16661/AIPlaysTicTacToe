import Groq from "groq-sdk";
import "dotenv/config";

// 1. Initialize client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY }); // groq

// System prompt
const systemPrompt = `You are a Tic Tac Toe player and your task is to predict the next best move.
You will be given:
1. The current board state.
2. Your symbol ('X' or 'O').

Output ONLY a number between 0 and 8 that represents the board cell where you want to place your symbol. 
If the place is already occupied then, choose another place.`;

// Abstract class
class AiModels {
  constructor(client, model, sysPrompt) {
    this.client = client;
    this.model = model;
    this.sysPrompt = sysPrompt;
  }

  async callModel() {
    throw new Error(
      "AiModels is an abstract class. Use a derived class instead."
    );
  }
}

// Concrete groq models implementation
class GroqModels extends AiModels {
  constructor(client, model, sysPrompt) {
    super(client, model, sysPrompt);
  }

  async callModel(boardView, currentPlayer) {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        temperature: 1,
        messages: [
          { role: "system", content: this.sysPrompt },
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

      const jsonContent = JSON.parse(
        response.choices[0].message.content || "{}"
      );
      console.log("Groq structured response:", jsonContent);
      return { move: jsonContent.move, success: true };
    } catch (error) {
      console.error("Error calling Groq:", error);
      return { move: -1, success: false, error: error.message };
    }
  }
}

// Model factory registry
const modelConfig = new Map([
  [
    "openai oss gpt 20b",
    {
      name: "openai/gpt-oss-20b",
      modelInstance: new GroqModels(groq, "openai/gpt-oss-20b", systemPrompt),
    },
  ],
  [
    "openai oss gpt 120b",
    {
      name: "openai/gpt-oss-120b",
      modelInstance: new GroqModels(groq, "openai/gpt-oss-120b", systemPrompt),
    },
  ],
  [
    "moonshotai kimi k2",
    {
      name: "moonshotai/kimi-k2-instruct-0905",
      modelInstance: new GroqModels(
        groq,
        "moonshotai/kimi-k2-instruct-0905",
        systemPrompt
      ),
    },
  ],
  [
    "meta llama 4 maverick 17b",
    {
      name: "meta-llama/llama-4-maverick-17b-128e-instruct",
      modelInstance: new GroqModels(
        groq,
        "meta-llama/llama-4-maverick-17b-128e-instruct",
        systemPrompt
      ),
    },
  ],
  [
    "meta llama 4 scout 17b",
    {
      name: "meta-llama/llama-4-scout-17b-16e-instruct",
      modelInstance: new GroqModels(
        groq,
        "meta-llama/llama-4-scout-17b-16e-instruct",
        systemPrompt
      ),
    },
  ],
]);

export { modelConfig };
