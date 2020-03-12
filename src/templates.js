//TODO implement plugin support

const yaml = require('js-yaml');
const fs = require('fs');
const utils = require('./utils/utils');
const exec = require('child_process').exec; //import the exec function, used for executing bash commands
const plugger = require('@nonamenpm/plugger');
const chalk = require('chalk');
const mem = require('./utils/mem');

let plugins = [];

//#region PLUGIN_ENTRY_POINT

exports.use = function(plugins) {
	plugger(plugins, this, false);
};

exports.pluginInfo = {};
exports.pluginList = '';

//entry point for plugins
exports.templateKeys = {
	create: function(file, element) {
		const fileToCreate = file;
		const createdDirs = {};

		for (let i = 0; i <= fileToCreate.length - 1; i++) {
			//console.log(fileToCreate[i].replace(/\(name\)/g, element));
			if (typeof fileToCreate[i] !== 'object') {
				if (utils.lastOf(fileToCreate[i], '/') !== -1) {
					let parsedFile = fileToCreate[i].replace(/\(name\)/g, element);

					fs.mkdir(parsedFile.substring(0, utils.lastOf(parsedFile, '/')), { recursive: true }, () => {
						createdDirs[parsedFile.substring(0, utils.lastOf(parsedFile, '/'))] ||
							console.log(
								chalk.greenBright(
									'	created directory: ' + parsedFile.substring(0, utils.lastOf(parsedFile, '/'))
								)
							);
						createdDirs[parsedFile.substring(0, utils.lastOf(parsedFile, '/'))] = true;
					});
					fs.writeFile('./' + parsedFile, '', () => {
						console.log(chalk.greenBright('	created file: ' + parsedFile));
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
		console.log(chalk.yellowBright('	this may take a while'));
	}
};

walk(process.env.TGENPATH + '../plugins/templateParser/');
exports.use(plugins);

//#endregion PLUGIN_ENTRY_POINT

exports.loadTemplates = function(element, logLevel) {
	try {
		var file = yaml.safeLoad(fs.readFileSync(process.env.TGENPATH + '/templates/' + element[0] + '.yaml', 'utf8')); //parse the yaml template
	} catch (e) {
		console.log(e);
		console.log(chalk.redBright('	error: template not found: ') + chalk.whiteBright(element[0]));
		return 1;
	}
	for (key in file) {
		try {
			console.log(exports.templateKeys);
			exports.templateKeys[key](file[key], element[1], file);
		} catch (e) {
			console.log(e);
			console.log(chalk.redBright('	error: unsupported key: ') + chalk.whiteBright("'" + key + "'."));
			return 1;
		}
	}
	return 0;
};

function walk(dir) {
	files = fs.readdirSync(dir);
	files.forEach((element) => {
		if (!mem.tgenSettings['plugins']['ignore'].includes(element.substring(0, utils.lastOf(element, '.')))) {
			exports.pluginList +=
				element.substring(0, utils.lastOf(element, '.')) + (files[files.length - 1] !== element ? ', ' : ' ');
			plugins.push(require(dir + element));
		}
	});
}
