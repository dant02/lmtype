// tutorial using lm studio https://lmstudio.ai/docs/typescript

import { Chat, LMStudioClient } from "@lmstudio/sdk";
import fs from 'fs';

async function main(): Promise<void> {
    const client = new LMStudioClient();

    const model = await client.llm.model('gemma-3-27b-it-qat', {
        config: {
            contextLength: 8192,
        },
    });

    console.info("Context length: " + await model.getContextLength());

    const root = 'D:\\elektlabs\\libnet\\ElektLabs.DataCore\\ElektLabs.DataCore\\';

    const dbFactory = await fs.promises.readFile(root + 'DBFactory.cs', 'utf8');
    const dbContext = await fs.promises.readFile(root + 'Connections\\DBContext.cs', 'utf8');

    const chat = Chat.from([
        //{ role: "user", content: 'Remember following code block for later queries: ```csharp\n' + dbFactory + '\n' },
        { role: "user", content: 'Remember following code block for later queries: ```csharp\n' + dbContext + '\n' },
        { role: "user", content: "Your senior .net developer, perform code review of class DBContext in previous code blocks." },
    ]);

    const formatted = await model.applyPromptTemplate(chat);
    const result = await model.complete(formatted, {
        maxTokens: 8192,
    });
    console.info(result.content);
}

main().catch(console.error);