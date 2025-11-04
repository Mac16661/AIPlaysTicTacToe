import Groq from "groq-sdk";
import "dotenv/config";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const models = new Map([
  ["openai oss gpt 20b", "openai/gpt-oss-20b"],
  ["openai oss gpt 120b", "openai/gpt-oss-120b"],
  ["moonshotai kimi k2", "moonshotai/kimi-k2-instruct-0905"],
  [
    "meta llama 4 maverick 17b",
    "meta-llama/llama-4-maverick-17b-128e-instruct",
  ],
  ["meta llama 4 scout 17b", "meta-llama/llama-4-scout-17b-16e-instruct"],
]);

const systemPrompt = `You are a Tic Tac Toe player and your task is to predict the next best move.
    You will be given:
    1. The current board state.
    2. Your symbol ('X' or 'O').

    Output ONLY a number between 0 and 8 that represents the board cell where you want to place your symbol. If the place is already occupied then, choose another place. If a board cell is already occupied then you must not choose that cell.`

export { groq, models, systemPrompt };
