import log from 'npmlog';

export const info = (text: string) => log.info('info','ℹ ' + text);
export const success = (text: string) => log.info('success','✔ ' + text);
export const warning = (text: string) => log.info('warning','⚠ ' + text);
export const error = (text: string) => log.info('error','✖ ' + text);
