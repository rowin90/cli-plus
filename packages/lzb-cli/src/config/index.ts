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
const HOST = 'http://10.10.20.151:8080';

// 任务列表
const TASK: ITask = {
  listing: {
    test: [
      '/view/seaseller-erp-test/job/ss-erp-test-lazmore-listing-front/build',
      '/view/seaseller-erp-test/job/ss-erp-test-seaseller-listing-front/build'
    ],
    online: [
      '/view/listing-online/job/listing-product-online-seaseller-front/build',
      '/view/listing-online/job/listing-product-online-lazmore-front/build'
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

// const SECRET = 'raoju:11971539c0573a6782b229acb5f72ba987';

export { config, TASK, HOST };
