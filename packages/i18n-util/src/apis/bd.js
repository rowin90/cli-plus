import axios from 'axios';
import {appid, key} from '../config';
import jsonpAdapter from 'axios-jsonp';
import MD5 from '../utils/bd_md5';

export function getTranslate_api({query = '',from = 'zh',to='en'}) {
    let salt = new Date().getTime();
    let str1 = appid + query + salt + key;
    let sign = MD5(str1);

    return axios({
        url: '/bd/api/trans/vip/translate',
        adapter: jsonpAdapter,
        params: {appid, key, q: query, from, to, salt, sign},
    }).then(res=>res.data);
}
