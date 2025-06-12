// tutorial using lm studio https://lmstudio.ai/docs/typescript

import { LMStudioClient } from "@lmstudio/sdk";

async function main(): Promise<void> {
    const client = new LMStudioClient();

    const model = await client.llm.model("deepseek/deepseek-r1-0528-qwen3-8b");
    const result = await model.respond("What is the meaning of life?");

    console.info(result.content);
}

main().catch(console.error);
