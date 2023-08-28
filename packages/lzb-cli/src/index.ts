const {execSync} = require('child_process');
const inquirer = require('inquirer');
const semver = require('semver');
const latestVersion = execSync('npm view @lzbbb/cli version')
    ?.toString()
    ?.trim();
const pkg = require('../package.json');
const log = require('./utils/log');
const localVersion = pkg.version;

if (latestVersion && semver.gt(latestVersion, localVersion)) {
    inquirer
        .prompt({
            type: 'confirm',
            name: 'isUpdate',
            message: '有新版本是否需要更新？'
        })
        .then(({isUpdate}: { isUpdate: boolean }) => {
            if (isUpdate) {
                console.log('npm i @lzbbb/cli@latest --production -g');
            }
        });
    // @ts-ignore
    return null;
}

const {program} = require('commander');
const {
    handleDeploy,
    handleLogin,
    getConfig,
    handleUniConfig,
    handleUpload
} = require('./action');
program.version(localVersion)
    .option('-d,--debug', '是否开启debug模式', false);

program.command('login').description('登录').action(handleLogin);

program.command('config').description('查看配置信息').action(getConfig);

program
    .command('resetUniConf')
    .description('重置uni-app项目配置')
    .action(handleUniConfig);
program
    .command('deploy')
// .option('-pre --pre','预览发布信息')
// .option('-c, --cheese <type>', 'add the specified type of cheese', 'blue')
    .description('部署应用')
    .action((...arg: any) => {
        let [options, program] = arg;
        handleDeploy({
            options,
            program
        });
    });

program.command('upload [filePath]').description('上传文件')
    .option('--server <server>', '上传服务器', '42.192.152.22')
    .option('--destPath <destPath>', '服务器地址', '/data/img/work/')
    .option('-f, --forcePush', '强制上传github更新', false)
    .option('-l, --list', '查看图床分类',false)
    .action((...arg: any) => {
        let [filePath, program] = arg;

        handleUpload({
            filePath,
            program
        });
    });

// 监听 debug 模式
program.on('option:debug', function () {
    if (program.opts().debug) {
        process.env.LOG_LEVEL = 'verbose';
    } else {
        process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
});

program.parse(process.argv);
