import type {Command} from 'commander';
import inquirer from 'inquirer';
import {TASK, HOST, config} from '@/config';
import shell from 'shelljs';
import {handleLogin} from './login';
import {info, error} from '@/utils/log';

interface Options {
  options: { pre: string };
  program: Command;
}

export const handleDeploy = async ({}: Options) => {

  if (!config.has('password')) {
    await handleLogin();
  }

  try {
    //@ts-ignore
    const username = config.get('username');
    const password = config.get('password');
    const token = username + ':' + password;

    // 1. 选择发布的项目
    const project = (await inquirer.prompt({
      type: 'list',
      name: 'project',
      message: '请选择发布的项目',
      choices: Object.keys(TASK).map(t => ({name: t, value: t}))
    })).project;
    const env = (await inquirer.prompt({
      type: 'list',
      name: 'env',
      message: '请选择发布的环境',
      choices: [
        {
          name: '测试',
          value: 'test'
        },
        {
          name: '线上',
          value: 'online'
        }
      ]
    })).env;
    if (env === 'online') {
      // 2. 是否发布线上
      const confirmDeploy = (await inquirer.prompt({
        type: 'confirm',
        name: 'confirmDeploy',
        message: '确定发布到【online】环境?',
        default: false
      })).confirmDeploy;
      if (!confirmDeploy) {
        return;
      }
    }

    // @ts-ignore
    let currentTask: any = TASK[project]?.[env] || [];
    for (let index = 0; index < currentTask.length; index++) {
      const task = currentTask[index];
      shell.exec(`curl -X POST ${HOST}${task} --user ${token}`);
    }
    info(`发布项目：${project}`);
    info(`发布环境：${env}`);
    info(`发布人：${username}`);
  } catch (e) {
    error('😭😭😭 发布失败' + '\n');
  }
};
