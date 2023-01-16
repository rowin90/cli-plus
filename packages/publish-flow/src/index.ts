import shell  from 'shelljs';
import { genExecSh } from '@/utils';
import { TASK } from '@/config';

const argv = process.argv.slice(2);

if(argv.length === 0){
  throw(new Error('请输入平台'));
}

if(argv.length === 1){
  throw(new Error('请输入环境'));
}

if(!TASK[argv[0]]){
  throw(new Error('没有找到发布任务，请检查发布平台配置 :' + argv[0]));
}
// @ts-ignore
if(!TASK[argv[0]][argv[1]]){
  throw(new Error(`没有找到【${argv[0]}】平台的 【${[argv[1]]}】环境，请检查发布平台配置 `));
}


try {
  //@ts-ignore
  let currentTask:any = TASK[argv[0]][argv[1]]  || [];
  for (let index = 0; index < currentTask.length; index++) {
    const task = currentTask[index];
    shell.exec(genExecSh(task));
  }
  console.log(`🎆🎆🎆 发布成功:【${argv[0]}】【${[argv[1]]}】环境` + '\n');
} catch (error) {
  console.log('😭😭😭 发布失败' + '\n');
}
