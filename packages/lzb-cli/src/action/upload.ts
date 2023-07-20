import fs from 'fs';
import path from 'path';
import {exec} from 'child_process';

interface Arg {
    filePath:string;
    program:{
        server:string
        destPath:string
    };
}

const GITHUB_REPO_LOCAL = '/Users/jerome/rowin90.github.io';

export const handleUpload = async ({filePath, program}:Arg) => {

    const stats = fs.statSync(filePath);

    const type:'github' | 'tencent' = 'github';
    if (type === 'github') {
        uploadToGithub(filePath, program);
    } else if (type === 'tencent') {
        uploadToTencentServer(stats, filePath, program);
    }
};

function uploadToGithub(filePath, program) {
    let {forcePush} = program;

    const virtualFileName = path.basename(filePath); // 获取文件名

    let folderName, fileName;
    if (virtualFileName.includes('__')) {
        // 如果有文件夹形式
        [folderName, fileName] = virtualFileName.split('__');
    } else {
        fileName = virtualFileName;
    }


    let localRepoPath = `${GITHUB_REPO_LOCAL}/images/`; // 目标路径

    if (folderName) {
        // 如果有文件夹
        localRepoPath = `${GITHUB_REPO_LOCAL}/images/${folderName}`; // 目标路径
    }

    function runCommand(command):Promise<void> {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    reject(error);
                } else {
                    console.log(stdout.trim());
                    resolve();
                }
            });
        });
    }

    // 如果是强制push，只用重新在push一次返回即可，github没有push成功
    if (forcePush) {
        // 创建文件夹，如果已存在则忽略
        runCommand(`cd ${GITHUB_REPO_LOCAL} && git push`)
            .then(() => console.log(`访问地址: https://rowin90.github.io/images/${folderName && folderName + '/'}${fileName}`))
            .catch((err) => console.error(err));

    } else {
        // 创建文件夹，如果已存在则忽略
        runCommand(`mkdir -p ${localRepoPath}`)
            .then(() => runCommand(`cp ${filePath} ${localRepoPath}`))
            .then(() => runCommand(`mv ${localRepoPath}/${virtualFileName}  ${localRepoPath}/${fileName}`))
            .then(() => runCommand('echo \'复制成功\''))
            .then(() => runCommand(`cd ${GITHUB_REPO_LOCAL} && git add .`))
            .then(() => runCommand('echo \'提交缓存区\''))
            .then(() => runCommand(`cd ${GITHUB_REPO_LOCAL} && git commit -m 'add: ${fileName}'`))
            .then(() => runCommand('echo \'提交仓库成功\''))
            .then(() => runCommand(`cd ${GITHUB_REPO_LOCAL} && git push`))
            .then(() => runCommand('echo \'上传成功\''))
            .then(() => console.log(`访问地址: https://rowin90.github.io/images/${folderName && folderName + '/'}${fileName}`))
            .catch((err) => console.error(err));
    }


}

function uploadToTencentServer(stats:fs.Stats, filePath:string, program:{ server:any; destPath:any; }) {
    const {server, destPath} = program;
    let sh = '';
    if (stats.isFile()) {
        sh = `scp ${filePath} root@${server}:${destPath}`;
    } else if (stats.isDirectory()) {
        sh = `scp -r ${filePath} root@${server}:${destPath}`;
    } else {
        console.log('非法路径');
        return;
    }

    const cp = exec(sh);

    // 成功时，stderr 有值
    cp.stderr?.on('data', (data) => {
        console.log('-> 上传失败', data);
    });

    cp.on('close', (e) => {
        if (e === 0) {
            // 地址是在 42.192.152.22:2000 配置的 nginx 配置规则的
            // 把 img 开头的转发到 /data 中
            if (stats.isFile()) {
                console.log('-> 上传成功：', `http://42.192.152.22:2000/img/${path.basename(filePath)}`);
            } else if (stats.isDirectory()) {
                console.log('-> 上传成功：', `http://42.192.152.22:2000/img/${path.basename(filePath)}`);
            }

        }
    });

}
