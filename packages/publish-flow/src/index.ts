const shell = require('shelljs');
const { SECRET } = require('./config.ts');

shell.echo(SECRET);