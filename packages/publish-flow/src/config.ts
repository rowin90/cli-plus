const SECRET = 'raoju:11971539c0573a6782b229acb5f72ba987';
// jenkins 域名
const HOST = 'http://10.10.20.151:8080';


interface env {
  test?:string[]
  online?:string[]
}
interface Task {
  listing:env
  [key:string]:env
}

const TASK:Task = {
  listing:{
    test:[
      '/view/seaseller-erp-test/job/ss-erp-test-lazmore-listing-front/build',
      '/view/seaseller-erp-test/job/ss-erp-test-seaseller-listing-front/build'
    ],
    online:[
      '/view/listing-online/job/listing-product-online-seaseller-front/build',
      '/view/listing-online/job/listing-product-online-lazmore-front/build'
    ]
  }
};

export {
  SECRET,
  HOST,
  TASK
};
