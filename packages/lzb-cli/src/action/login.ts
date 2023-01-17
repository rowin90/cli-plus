// @ts-ignore
import inquirer from 'inquirer';
import { config } from '@/config';

export const handleLogin = async () => {
  try {
    const { username, password } = await inquirer.prompt<{
      username: string
      password: string
    }>([
      { type: 'input', name: 'username', message: '输入您的jenkins账户名' },
      {
        type: 'password',
        name: 'password',
        message: '输入您的jenkins的token'
      }
    ]);
    config.set('username', username);
    config.set('password', password);
  } catch (e) {
    process.exit(-1);
  }
};
