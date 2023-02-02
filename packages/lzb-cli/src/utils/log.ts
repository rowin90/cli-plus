import log from 'npmlog';

// 判断 debug 模式
log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info';
// 修改定制
log.heading = 'lzb-cli';
log.headingStyle = { fg: 'red', bg: 'black' };

export const info = (text: string) => log.info('info','ℹ ' + text);
export const success = (text: string) => log.info('success','✔ ' + text);
export const warning = (text: string) => log.info('warning','⚠ ' + text);
export const error = (text: string) => log.info('error','✖ ' + text);
export const verbose = (text: string) => log.verbose('debug','ℹ ' + text);

export default log;
