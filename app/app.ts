// tutorial using lm studio https://lmstudio.ai/docs/typescript

import { Chat, LMStudioClient, FileHandle } from "@lmstudio/sdk";
import fs from 'fs/promises';
import readline from 'readline/promises';

async function main(): Promise<void> {
    const client = new LMStudioClient();
    /* LLM */
    let modelName = 'deepseek-r1-0528-qwen3-8b';
    const llmodel = await client.llm.model(modelName, {
        config: {
            contextLength: 8192,
        },
    });

    /* embedding */
    modelName = 'text-embedding-nomic-embed-text-v1.5';
    const model = await client.embedding.model(modelName);

    console.info("Context length: " + await model.getContextLength());

    const root = 'D:\\elektlabs\\libnet\\ElektLabs.DataCore\\ElektLabs.DataCore\\';

    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const files: Array<FileHandle> = [];
    const Prep = async function (fileName: string) {
        let h = await client.files.prepareFile(fileName);
        console.info('prepared: ' + h.name);
        files.push(h);
    };


    let d = await fs.readdir(root, { withFileTypes: true, recursive: true });
    for (const f of d) {
        if (!f.name.endsWith('.cs')) continue;
        await Prep(f.parentPath + '\\' + f.name);
    }

    console.info('Cnt of prepared files: ' + files.length);

    const r = await client.files.retrieve("Prepare documents", files, { embeddingModel: model });

    const chat = Chat.from([
        { role: "user", content: "Do you have access to source code of class ElDbConnection? It should be available in prepared files.", },
    ]);
    const formatted = await llmodel.applyPromptTemplate(chat);
    const result = await llmodel.complete(formatted, {
        maxTokens: 8192,
    });
    console.info(result.content);

    let q = await rl.question('Q:?');
    if (q) {
        console.info('Q: ' + q);
    }
}

main().catch(console.error);