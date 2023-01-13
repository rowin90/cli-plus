import { SECRET, HOST } from './config';

const genExecSh = (task: string) => {
  return `curl -X POST ${HOST}${task} --user ${SECRET}`;
};

export {
  genExecSh
};