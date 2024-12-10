import OpenAI from 'openai';
import inquirer from 'inquirer';

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.shellgpt.top/v1'
});

export async function handleAi() {


    const question = (await inquirer.prompt({
        type: 'input',
        name: 'question',
        message: '请说出你的问题'
    })).question;



    const stream = await client.chat.completions.create({
        model: 'gpt-3.5-turbo-0125',
        messages: [
            {role: 'user', content: question}
        ],
        stream: true
    });

    for await (const chunk of stream) {
        process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }
}
