//TODO implement plugin support

const yaml = require('js-yaml');
const fs = require('fs');
const utils = require('./utils/utils');
const exec = require('child_process').exec; //import the exec function, used for executing bash commands
const plugger = require('@nonamenpm/plugger');
const chalk = require('chalk');

let plugins = [];

//#region PLUGIN_ENTRY_POINT

exports.use = function(plugins) {
	plugger(plugins, this, false);
};

//entry point for plugins
exports.templateKeys = {
	create: function(file, element) {
		const fileToCreate = file;
		let lastindex = 0;
		for (let i = 0; i <= fileToCreate.length - 1; i++) {
			//console.log(fileToCreate[i].replace(/\(name\)/g, element));
			if (typeof fileToCreate[i] !== 'object') {
				if (utils.lastOf(fileToCreate[i], '/') !== -1) {
					let parsedFile = fileToCreate[i].replace(/\(name\)/g, element);

					fs.mkdir(parsedFile.substring(0, utils.lastOf(parsedFile, '/')), { recursive: true }, () => {
						console.log(
							chalk.greenBright(
								'		created directory: ' + parsedFile.substring(0, utils.lastOf(parsedFile, '/'))
							)
						);
					});
					fs.writeFile('./' + parsedFile, '', () => {
						console.log(chalk.greenBright('		created file: ' + parsedFile));
					});
				} else {
					const parsedFile = fileToCreate[i].replace(/\(name\)/g, element);
					fs.writeFile('./' + parsedFile, '', () => {});
				}
			}
		}
	},
	commands: function(file, element) {
		const commands = file || [ 'echo' ];
		for (let i = 0; i <= commands.length - 1; i++) {
			exec(commands[i].replace(/\(name\)/g, element));
			console.log(chalk.cyan('	ran command: ' + commands[i].replace(/\(name\)/g, element)));
		}
	}
};

walk('../plugins/templateParser/');
exports.use(plugins);

//#endregion PLUGIN_ENTRY_POINT

exports.loadTemplates = function(element, logLevel) {
	const file = yaml.safeLoad(fs.readFileSync('./templates/' + element[0] + '.yaml', 'utf8')); //parse the yaml template

	for (key in file) {
		try {
			exports.templateKeys[key](file[key], element[1]);
		} catch (e) {
			console.log(e);
			console.log("Unsupported key: '" + key + "'.");
		}
	}
	return 0;
};

function walk(dir) {
	files = fs.readdirSync(dir);
	files.forEach((element) => {
		plugins.push(require(dir + element));
	});
}
