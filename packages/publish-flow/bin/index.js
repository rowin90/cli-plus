#!/usr/bin/env node
const path = require('path')
const { exec } = require('child_process')
// console.log("-> process.argv", process.argv);
const currentFile= path.resolve(__dirname,'../dist/index')

const cp = exec(`node ${currentFile} ${process.argv.slice(2).join(' ')}`, function (err, out, stderr) {
    if (err instanceof Error) {
        console.error('错误err',err)
        process.exit(1)
    }
    console.log(out);
});

// cp.stdout.pipe(process.stdout)
