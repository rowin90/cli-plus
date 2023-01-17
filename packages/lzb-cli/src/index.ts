const { execSync } = require('child_process');
const inquirer = require('inquirer');
const semver = require('semver');
const latestVersion = execSync('npm view @lzbbb/cli version')?.toString()?.trim();
const pkg = require('../package.json');
const localVersion = pkg.version;

if (latestVersion && semver.gt(latestVersion, localVersion)) {
  inquirer.prompt({
    type: 'confirm',
    name: 'isUpdate',
    message: '有新版本是否需要更新？'
  }).then(({ isUpdate }:{isUpdate:boolean}) => {
    if (isUpdate) {
      console.log('npm i @lzbbb/cli@latest --production -g');
    }
  });
  // @ts-ignore
  return null;
}


const { program } = require('commander');
const {
  handleDeploy,
  handleLogin,
  getConfig
} = require('./action');
program.version(localVersion);
program.command('login').description('登录').action(handleLogin);
program.command('config').description('查看配置信息').action(getConfig);
program
  .command('deploy')
// .option('-pre --pre','预览发布信息')
// .option('-c, --cheese <type>', 'add the specified type of cheese', 'blue')
  .description('部署应用')
  .action((...arg:any) => {
    let [options,program] = arg;
    handleDeploy({
      options,program
    });
  });



program.parse(process.argv);
