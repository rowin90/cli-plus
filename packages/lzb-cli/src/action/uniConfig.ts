/**
 * @deprecated 废弃.不需要配置uni的地址
 */
// @ts-ignore
import inquirer from 'inquirer';
import { config, TASK } from '@/config';
import { info } from '@/utils/log';

export const handleUniConfig = async () => {
  try {
    const { uni_project, dist } = await inquirer.prompt<{
      uni_project: string
      dist: string
    }>([
      {
        type: 'list',
        name: 'uni_project',
        message: '选择要录入的uni-app项目名',
        choices: Object.keys(TASK)
          .filter((i) => i.includes('app'))
          .map((t) => ({ name: t, value: t }))
      },
      {
        type: 'input',
        name: 'dist',
        message: '输入本地构建的目录'
      }
    ]);
    info(`${uni_project}项目，本地打包路径为:${dist}`);

    const uni = config.get('uni') || {};
    uni[uni_project] = dist;
    config.set('uni', uni);
  } catch (e) {
    process.exit(-1);
  }
};
