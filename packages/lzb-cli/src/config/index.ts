import Conf from 'conf';
import type { ITask } from '@/types/deploy';

interface Config {
  // jenkins 账号
  username: string
  // jenkins 密码
  password: string
  // uni 的配置
  uni: {
    'pdy-app(h5)': string
    [key: string]: string
  }
}

const config = new Conf<Config>({});

// jenkins 域名
const HOST = 'http://jenkins-test.lazbao.com';

// 任务列表
const TASK: ITask = {
  listing: {
    test: [
      '/view/listing-product-test/job/listing-product-test-lazmore-front//build',
      '/view/listing-product-test/job/listing-product-test-seaseller-front/build'
    ],
    online: [
      '/view/listing-product-online/job/listing-product-online-seaseller-front/build',
      '/view/listing-product-online/job/listing-product-online-lazmore-front/build'
    ]
  },
  'pdy-app(h5)': {
    type: 'uni-app',
    appProjectName: 'pdy-app',
    test: ['admin@10.10.20.136:/home/wwwroot/pdyh5'],
    online: ['']
  },
  userCenter: {
    test: ['/view/seaseller-erp-test/job/ss-erp-test-pc-front/build'],
    online: ['/view/fe-seaseller/job/fe-ss-prod-erp-front/build']
  },
  seaSeller: {
    test: ['/view/fe-seaseller/job/fe-ss-test-seaseller-front/build'],
    online: ['/view/fe-seaseller/job/fe-ss-prod-seaseller-front/build']
  }
};

export { config, TASK, HOST };
