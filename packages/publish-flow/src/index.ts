import shell  from 'shelljs';
import { genExecSh } from './utils';
const argv = process.argv.slice(1);
console.log('argv: ', argv);
console.log('shell: ', shell);

// test
const tasks_test = [
  '/view/seaseller-erp-test/job/ss-erp-test-lazmore-listing-front/build',
  '/view/seaseller-erp-test/job/ss-erp-test-seaseller-listing-front/build'
];

// online
// const tasks_online = [
//   '/view/listing-online/job/listing-product-online-seaseller-front/build',
//   '/view/listing-online/job/listing-product-online-lazmore-front/build'
// ];


try {
  for (let index = 0; index < tasks_test.length; index++) {
    const task = tasks_test[index];
    shell.exec(genExecSh(task));
  }
  shell.echo('🎆🎆🎆 发布成功' + '\n');
} catch (error) {
  shell.echo('😭😭😭 发布失败' + '\n');
}
