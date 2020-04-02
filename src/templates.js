// #region LICENSE

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

// #endregion LICENSE

const yaml = require('js-yaml');
const fs = require('fs');
const utils = require('./utils/utils');
const exec = require('child_process').exec; // import the exec function, used for executing bash commands
const logger = require('./utils/logger.js');
const plugger = require('@nonamenpm/plugger');
const chalk = require('chalk');
const mem = require('./utils/mem');
const messages = require('./messages.js');

const error = messages.newMessageType('error');

const plugins = [];

// #region PLUGIN_ENTRY_POINT

exports.use = function(plugins) {
	plugger(plugins, this, false);
};

exports.pluginInfo = {};
exports.pluginList = '';

exports.loadPlugins = function(file) {
	walk(process.env.TGENPATH + '../plugins/templateParser/', file);
	exports.use(plugins);
};

// entry point for plugins
exports.templateKeys = {
	create: function(file) {
		const fileToCreate = file;
		const createdDirs = {};

		for (let i = 0; i <= fileToCreate.length - 1; i++) {
			// console.log(mem.replaceVars(fileToCreate[i]));
			if (typeof fileToCreate[i] !== 'object') {
				if (utils.lastOf(fileToCreate[i], '/') !== -1) {
					const parsedFile = mem.replaceVars(fileToCreate[i]);

					// create the directories
					fs.mkdirSync(parsedFile.substring(0, utils.lastOf(parsedFile, '/')), { recursive: true });
					createdDirs[parsedFile.substring(0, utils.lastOf(parsedFile, '/'))] ||
						logger(
							'created directory: ' +
								chalk.whiteBright(parsedFile.substring(0, utils.lastOf(parsedFile, '/'))),
							'success'
						);
					/*
					console.log(
							chalk.greenBright(
								'	created directory: ' +
									chalk.whiteBright(parsedFile.substring(0, utils.lastOf(parsedFile, '/')))
							)
						);
								*/

					createdDirs[parsedFile.substring(0, utils.lastOf(parsedFile, '/'))] = true;

					// if a slash is at the end, assume we aren't creating a file
					if (utils.lastOf(parsedFile, '/') !== parsedFile.length - 1) {
						fs.writeFileSync('./' + parsedFile, '');
						logger('created file: ' + chalk.whiteBright(parsedFile), 'success');
					}
				} else {
					const parsedFile = mem.replaceVars(fileToCreate[i]);
					fs.writeFileSync('./' + parsedFile, '');
				}
			}
		}
	},
	commands: function(file) {
		const commands = file || [ 'echo' ];
		let chainedCommand = '';

		for (let i = 0; i <= commands.length - 1; i++) {
			// exec(commands[i].replace(/\(name\)/g, element));
			chainedCommand += i === commands.length - 1 ? commands[i] : commands[i] + ' && ';

			logger('ran command: ' + chalk.whiteBright(mem.replaceVars(commands[i])), 'info');
		}

		exec(mem.replaceVars(chainedCommand));

		logger('this may take a while', 'warning');
	}
};

// #endregion PLUGIN_ENTRY_POINT

exports.loadTemplates = function(element) {
	try {
		// if TGENPATH is not set, return 1
		if (!process.env.TGENPATH) {
			console.log(chalk.redBright('error: TGENPATH env variable not set.'));
			console.log(
				chalk.cyanBright(
					'In your shell startup file (.bashrc or .zshrc if you have zsh installed), please add this line:'
				)
			);
			logger('export TGENPATH="/usr/local/lib/node_modules/tgen/src/"');
			return 1;
		}

		// load file, TGENPATH is the path to where tgen is installed
		var extension = fs.existsSync(process.env.TGENPATH + '/templates/' + element[0] + '.yaml') ? '.yaml' : '.yml';
		var file = yaml.safeLoad(
			fs.readFileSync(process.env.TGENPATH + '/templates/' + element[0] + extension, 'utf8')
		); // parse the yaml template
	} catch (e) {
		if (e.name === 'YAMLException') {
			// bad formatting in template
			logger(
				error(chalk.redBright('error: bad formatting in template: '), 'yaml_bad_formatting') +
					chalk.whiteBright(element[0]),
				'error'
			);
		} else {
			// template not found
			logger(
				error(chalk.redBright('error: template not found: '), 'template_not_found') +
					chalk.whiteBright(element[0]),
				'error'
			);
		}
		return 1;
	}

	exports.loadPlugins(file);

	console.log(
		chalk.cyanBright(
			'executing template: ' +
				element[0] +
				', ' +
				(exports.pluginList
					? 'with template plugins: ' + chalk.whiteBright(exports.pluginList)
					: 'with no template plugins installed.')
		)
	);

	for (let key in file) {
		try {
			exports.templateKeys[key](file[key], element[1], file);
		} catch (e) {
			console.log(e);
			if (e instanceof TypeError) {
				logger(chalk.redBright('error: unsupported key: ') + chalk.whiteBright("'" + key + "'."), 'error');
			}
			return 1;
		}
	}
	return 0;
};

function walk(dir, objTree) {
	let files = fs.readdirSync(dir);
	let count = 0;

	if (!objTree) {
		return 1;
	}

	if (!objTree.use) {
		files.forEach((element) => {
			if (count === 4) {
				exports.pluginList += chalk.cyanBright(
					'and ' +
						String(files.length - count) +
						(files.length - count === 1 ? ' more plugin.' : ' more plugins.')
				);
			}

			if (!mem.tgenSettings.plugins.ignore.includes(element.substring(0, utils.lastOf(element, '.')))) {
				if (count < 4) {
					exports.pluginList +=
						element.substring(0, utils.lastOf(element, '.')) +
						(files[files.length - 1] !== element ? ', ' : '.');
				}
				plugins.push(require(dir + element));
			}
			count++;
		});
	} else if (objTree.use) {
		// load the use key, if objTree is undefined we return an empty array
		files = objTree ? objTree.use : [];

		// loop through the array, and load the plugins
		files.forEach((element) => {
			// user is trying directory traversal
			if (element.includes('/')) {
				element = element.substring(utils.lastOf(element, '/') + 1);
			}

			// check if file exists
			if (!fs.existsSync(dir + element + '.js')) {
				logger('error: plugin not found: ' + chalk.whiteBright(element), 'error');
				// separator
				console.log();
				process.exit(1);
			}

			if (count === 4) {
				exports.pluginList += chalk.cyanBright(
					'and ' +
						String(files.length - count) +
						(files.length - count === 1 ? ' more plugin.' : ' more plugins.')
				);
			}

			if (count < 4) {
				exports.pluginList += element + (files[files.length - 1] !== element ? ', ' : '.');
			}

			plugins.push(require(dir + element + '.js'));

			count++;
		});
		objTree ? delete objTree.use : '';
	}
}
