import fs from 'fs';
import path from 'path';
import {exec} from 'child_process';

interface Arg {
  filePath:string;
  program: {
    server:string
    destPath:string
  }
}

export const handleUpload =  async ({filePath,program}:Arg) => {
  const {server,destPath} = program;

  const stats = fs.statSync(filePath);

  let sh = '';
  if(stats.isFile()){
    sh = `scp ${filePath} root@${server}:${destPath}`;
  }else if(stats.isDirectory()){
    sh = `scp -r ${filePath} root@${server}:${destPath}`;
  }else{
    console.log('非法路径');
    return;
  }

  const cp = exec(sh);

  // 成功时，stderr 有值
  cp.stderr?.on('data', (data) => {
    console.log('-> 上传失败', data);
  });

  cp.on('close',(e)=>{
    if(e === 0){
      // 地址是在 42.192.152.22:2000 配置的 nginx 配置规则的
      // 把 img 开头的转发到 /data 中
      if(stats.isFile()){
        console.log('-> 上传成功：',`http://42.192.152.22:2000/img/${path.basename(filePath)}`);
      }else if(stats.isDirectory()){
        console.log('-> 上传成功：',`http://42.192.152.22:2000/img/${path.basename(filePath)}`);
      }

    }

  });






};
