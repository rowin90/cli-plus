#!/usr/bin/env node
const path = require('path')
const { exec } = require('child_process')
const importLocal = require('import-local')


if(importLocal(__filename)){
    require('npmlog').info('cli','正在使用 lzb-cli 本地版本测试')
}else{
    require(path.resolve(__dirname , '../dist/index'))
}
