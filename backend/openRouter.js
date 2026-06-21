import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const apiKey = process.env.OPENROUTER_API_KEY;
console.log("OpenRouter Key present:", !!apiKey);

const models = [
  "google/gemini-2.0-flash-001",
  "google/gemini-flash-1.5",
  "google/gemini-pro-1.5",
  "google/gemini-2.0-flash-exp:free",
  "google/gemini-flash-1.5-8b-exp:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "anthropic/claude-3-haiku",
];

async function testModel(client, model) {
  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: "Say hi" }],
      max_tokens: 10,
    });
    console.log(`  ✅ ${model}: "${completion.choices[0]?.message?.content?.trim()}"`);
    return true;
  } catch (err) {
    console.log(`  ❌ ${model}: ${err.message.substring(0, 80)}`);
    return false;
  }
}

async function test() {
  const client = new OpenAI({ apiKey, baseURL: "https://openrouter.ai/api/v1" });
  for (const m of models) {
    const ok = await testModel(client, m);
    if (ok) {
      console.log(`\n✅ Use model: "${m}"`);
      return;
    }
  }
  console.log("\n❌ No models worked. Check your OpenRouter account.");
}

test();