import type {Command} from 'commander';
import inquirer from 'inquirer';
import {TASK, HOST, config} from '@/config';
import {exec} from 'child_process';
import shell from 'shelljs';
import {handleLogin} from './login';
import {handleUniConfig} from './uniConfig';
import {info, error, verbose} from '@/utils/log';
import {isWindows} from '@/utils/tools';
import type {IEnv} from '@/types/deploy';
import {ITask} from '@/types/deploy';
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
    const project = (
      await inquirer.prompt({
        type: 'list',
        name: 'project',
        message: '请选择发布的项目',
        choices: Object.keys(TASK).map((t) => ({name: t, value: t}))
      })
    ).project;
    const env = (
      await inquirer.prompt({
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
      })
    ).env;
    if (env === 'online') {
      // 2. 是否发布线上
      const confirmDeploy = (
        await inquirer.prompt({
          type: 'confirm',
          name: 'confirmDeploy',
          message: '确定发布到【线上】环境?',
          default: false
        })
      ).confirmDeploy;
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
    // info(`发布项目：${project}`);
    // info(`发布环境：${env}`);
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
const uniH5 = async (project: keyof ITask, env: 'test' | 'online') => {
  return new Promise(async (resolve) => {
    const appConfig = TASK[project] as IEnv;
    const dest = appConfig[env]?.[0];
    const appProjectName = appConfig?.appProjectName;
    let dist = '';

    if (isWindows) {
      // windows 系统，需要自己打包上传，cli 中只做上传的部分
      dist = await get_UniH5_win_dist(project, env);
    } else {
      // mac 可以自动打包并上传
      dist = get_UniH5_mac_dist(appProjectName!);

    }

    info('开始上传文件:');
    verbose(`-> 本地打包后 uni-app h5项目地址: ${dist}`);
    shell.exec(`scp -r ${dist} ${dest}`);
    resolve('');
  });
};

// 解析uni-app h5 打包后的 path
const _resolvePathBuildH5 = (str: string): string => {
  let res = str.match(/路径为：(.*)\n/);
  if (res && res[1]) {
    return res[1];
  }
  throw new Error('未解析到打包结果，请检查');
};

const get_UniH5_win_dist = (project: keyof ITask, env: 'test' | 'online'): Promise<string> => {
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
        resolve(dist);
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

const get_UniH5_mac_dist = (appProjectName:string):string =>{
  let child = shell.exec(
    `/Applications/HBuilderX.app/Contents/MacOS/cli publish --platform h5 --project ${appProjectName}`
  );
  return _resolvePathBuildH5(child.stdout);
};
