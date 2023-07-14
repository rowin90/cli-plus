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
    '采集插件': {
        test: ['/view/node/job/node-test-erp-gather-server/build'],
        online: ['/view/node/job/node-prod-erp-gather-server/build']
    },
    'PDD插件': {
        test: ['/view/node/job/node-dev-pdd-order-server/build'],
        online: ['/view/node/job/node-prod-pdd-order-server/build']
    },
    '运营工具箱': {
        type:'monorepo',
        monorepoProject:{
            '以图搜款':'image-search',
            '工具看板':'tool-dashboard',
            '服务端':'server',
            '活动看板':'activity-dashboard',
            '报活动':'activity-regist'
        },
        online: ['/view/node/job/node-prod-search-image-server/buildWithParameters']
    },
    '刊登': {
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
    '用户中心': {
        test: ['/view/seaseller-erp-test/job/ss-erp-test-pc-front/build'],
        online: ['/view/fe-seaseller/job/fe-ss-prod-erp-front/build']
    },
    seaSeller: {
        test: ['/view/fe-seaseller/job/fe-ss-test-seaseller-front/build'],
        online: ['/view/fe-seaseller/job/fe-ss-prod-seaseller-front/build']
    }
};

export { config, TASK, HOST };
