import OpenAI from 'openai';
import inquirer from 'inquirer';

const client = new OpenAI({
    apiKey: 'sk-D266e1bZ20sDTyyp5e344859C47042De84Ee5d9f1f55Fc28',
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
