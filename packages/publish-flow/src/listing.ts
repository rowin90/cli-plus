const shell = require('shelljs');
const { SECRET,HOST } = require('./config.ts');


// test
const tasks_test = [
  '/view/seaseller-erp-test/job/ss-erp-test-lazmore-listing-front/build',
  '/view/seaseller-erp-test/job/ss-erp-test-seaseller-listing-front/build'
];

// online
const tasks_online = [
  '/view/listing-online/job/listing-product-online-seaseller-front/build',
  '/view/listing-online/job/listing-product-online-lazmore-front/build'
];


for (let index = 0; index < tasks_test.length; index++) {
  const task = tasks_test[index];
  let sh = `curl -X POST ${HOST}${task} --user ${SECRET}`;
  shell.exec(sh);
  shell.echo('发布成功' + '\n');

}