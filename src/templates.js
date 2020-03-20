//TODO implement plugin support

//#region LICENSE

/*
	File used in tgen for template handling.
    Copyright (C) 2020 Christian

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

//#endregion LICENSE

const yaml = require('js-yaml');
const fs = require('fs');
const utils = require('./utils/utils');
const exec = require('child_process').exec; //import the exec function, used for executing bash commands
const logger = require('./utils/logger.js');
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

		logger('this may take a while', 'warning');
	}
};

walk(process.env.TGENPATH + '../plugins/templateParser/');
exports.use(plugins);

//#endregion PLUGIN_ENTRY_POINT

exports.loadTemplates = function(element, logLevel) {
	try {
		//if TGENPATH is not set, return 1
		if (!process.env.TGENPATH) {
			console.log(chalk.redBright('error: TGENPATH env variable not set.'));
			return 1;
		}

		//load file, TGENPATH is the path to where tgen is installed
		var extension = fs.existsSync(process.env.TGENPATH + '/templates/' + element[0] + '.yaml') ? '.yaml' : '.yml';
		var file = yaml.safeLoad(
			fs.readFileSync(process.env.TGENPATH + '/templates/' + element[0] + extension, 'utf8')
		); //parse the yaml template
	} catch (e) {
		if (e.name === 'YAMLException') {
			//bad formatting in template
			console.log(chalk.redBright('	error: bad formatting in template: ') + chalk.whiteBright(element[0]));
		} else {
			//template not found
			console.log(chalk.redBright('	error: template not found: ') + chalk.whiteBright(element[0]));
		}
		return 1;
	}
	for (key in file) {
		try {
			exports.templateKeys[key](file[key], element[1], file);
		} catch (e) {
			console.log(chalk.redBright('	error: unsupported key: ') + chalk.whiteBright("'" + key + "'."));
			return 1;
		}
	}
	return 0;
};

function walk(dir) {
	let files = fs.readdirSync(dir);
	let count = 0;

	files.forEach((element) => {
		if (count === 4) {
			exports.pluginList += chalk.cyanBright(
				'and ' +
					String(files.length - count) +
					(files.length - count === 1 ? ' more plugin.' : ' more plugins.')
			);
		}

		if (
			!mem.tgenSettings['plugins']['ignore'].includes(element.substring(0, utils.lastOf(element, '.'))) &&
			count < 4
		) {
			exports.pluginList +=
				element.substring(0, utils.lastOf(element, '.')) + (files[files.length - 1] !== element ? ', ' : ' ');
			plugins.push(require(dir + element));
		}
		count++;
	});
}
