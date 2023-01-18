import type {Command} from 'commander';
import inquirer from 'inquirer';
import {TASK, HOST, config} from '@/config';
import {exec} from 'child_process';
import shell from 'shelljs';
import {handleLogin} from './login';
import {handleUniConfig} from './uniConfig';
import {info, error} from '@/utils/log';
import fs from 'fs';


interface Options {
  options: { pre: string };
  program: Command;
}

export const handleDeploy = async ({}: Options) => {

  if (!config.has('password')) {
    await handleLogin();
  }

  const username = config.get('username');
  const password = config.get('password');
  const token = username + ':' + password;

  try {
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
        message: '确定发布到【线上】环境?',
        default: false
      })).confirmDeploy;
      if (!confirmDeploy) {
        return;
      }
    }

    // 发布
    // @ts-ignore
    if (TASK[project].type === 'uni-app') {
      await uniH5(project, env);
    } else {
      await pureWeb(project, env, token);
    }

    info('🚀🚀🚀 发布成功');
    info(`发布项目：${project}`);
    info(`发布环境：${env}`);


  } catch (e) {
    error('😭😭😭 发布失败');
    error('错误原因:' + e);
  }
};


const pureWeb = (project: string, env: string, token: string) => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    // 当前环境的任务
    let currentTask: any = TASK[project]?.[env] || [];

    for (let index = 0; index < currentTask.length; index++) {
      const task = currentTask[index];
      const cp = exec(`curl -X POST ${HOST}${task} --user ${token}`);
      // 失败时，stdout 会输出
      cp.stdout?.on('data', () => {
        reject('请求发布任务失败，请检查job配置，或者token失效');
      });

      // 成功时，stderr 有值
      cp.stderr?.on('data', () => {
        // console.log('error 输出:', err);
      });

      // hack 如果任务执行完了
      if (index + 1 === currentTask.length) {
        setTimeout(resolve, 1000);
      }

    }

  });

};

// UNI-APP H5
const uniH5 = async (project: string, env: string) => {
  return new Promise(async (resolve, reject) => {

    let conf = config.get('uni');
    let dist = conf?.[project];
    if (dist) {
      // 如果配置了本地的打包路径
      // @ts-ignore
      let dest: any = TASK[project]?.[env];
      const checkDir = fs.existsSync(dist);
      if (checkDir) {
        info(`检查本地目录:${dist}`);
        if (!dist.endsWith('/')) {
          dist = dist + '/';
        }
        shell.exec(`scp -r ${dist} ${dest}`);
        resolve('');
      } else {
        reject(`${dist} 目录不存在`);
      }

    } else {
      // 如果没有配置本地打包
      await handleUniConfig();
      reject('配置更新，请重新发布');
      return;
    }
  });
};
