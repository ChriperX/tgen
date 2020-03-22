#!/usr/local/bin/node

//#region LICENSE

/*
	Entry point for tgen, the open source templating engine.
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

const template = require('./templates');
const tp = require('@nonamenpm/text-parser');
const fs = require('fs');
const chalk = require('chalk');
const yaml = require('js-yaml');
const utils = require('./utils/utils');
const logger = require('./utils/logger');
const plugger = require('@nonamenpm/plugger');
const mem = require('./utils/mem');

const TGEN_VERSION = '1.0.0';
const INFO_NOT_GIVEN = 'not given';

let logLevel;
let plugins = [];

//#region PLUGIN_ENTRY_POINT

//entry point for plugins
exports.commands = {};

//object that defines information about a plugin
exports.pluginInfo = {};

exports.use = function(plugin) {
	plugger(plugin, this, false);
};

function addCustomCommands() {
	for (key in exports.commands) {
		//loops through the commands object and adds the commands
		tp.add(exports.commands[key]['command'], exports.commands[key]['cb'], exports.commands[key]['desc']);
	}
}

function walk(dir) {
	files = fs.readdirSync(dir);
	files.forEach((element) => {
		if (!mem.tgenSettings['plugins']['ignore'].includes(element.substring(0, utils.lastOf(element, '.')))) {
			plugins.push(require(dir + element));
		}
	});
}

walk(process.env.TGENPATH + '../plugins/parser/');
exports.use(plugins);
addCustomCommands();

//#endregion PLUGIN_ENTRY_POINT

//creates a new project from a template
exports.newTemplate = function(element) {
	mem.newVar(element[1], 'name');

	//we return the exit status
	return template.loadTemplates(element, logLevel);
};

tp.error((token) => {
	logger('error: unrecognized token ' + chalk.whiteBright("'" + token + "'."), 'error');
});

//add the new command, with template and name
tp.add('new <template> <name>', exports.newTemplate, 'Create new project from template.');

//alias for new
tp.add('exec <template> <name>', exports.newTemplate, 'Alias of new.');

tp.add(
	'plugin <option> <pluginName>',
	(element) => {
		if (element[0] === 'info') {
			template.loadPlugins({});

			if (exports.pluginInfo[element[1]]) {
				//log info about a plugin
				console.log(chalk.cyan('info about plugin ') + chalk.whiteBright(element[1]) + ':');
				logger('version: ' + chalk.whiteBright(exports.pluginInfo[element[1]]['version']), 'info');
				logger('author: ' + chalk.whiteBright(exports.pluginInfo[element[1]]['author']), 'info');
				logger('repo: ' + chalk.whiteBright(exports.pluginInfo[element[1]]['repo']), 'info');
				logger('extends: ' + chalk.whiteBright(exports.pluginInfo[element[1]]['extension']), 'info');
				logger('description: ' + chalk.whiteBright(exports.pluginInfo[element[1]]['description']), 'info');
			} else if (template.pluginInfo[element[1]]) {
				//log info about a plugin
				console.log(chalk.cyan('info about plugin ') + chalk.whiteBright(element[1] + ':'));
				logger(
					'version: ' + chalk.whiteBright(template.pluginInfo[element[1]]['version'] || INFO_NOT_GIVEN),
					'info'
				);
				logger(
					'author: ' + chalk.whiteBright(template.pluginInfo[element[1]]['author'] || INFO_NOT_GIVEN),
					'info'
				);
				logger('repo: ' + chalk.whiteBright(template.pluginInfo[element[1]]['repo'] || INFO_NOT_GIVEN), 'info');
				logger(
					'extends: ' + chalk.whiteBright(template.pluginInfo[element[1]]['extends'] || INFO_NOT_GIVEN),
					'info'
				);
				logger(
					'description: ' +
						chalk.whiteBright(template.pluginInfo[element[1]]['description'] || INFO_NOT_GIVEN),
					'info'
				);
			} else {
				if (element[1]) {
					console.log(chalk.redBright('error: non-existent plugin: ') + chalk.whiteBright(element[1]));
				} else {
					console.log(chalk.redBright('error: please specify a plugin.'));
				}
				return 1;
			}
		}
		if (element[0] === 'ignore') {
			//ignore a plugin
			console.log(chalk.cyanBright('ignoring plugin: ' + element[1]));
			//pushes to tgenSetting the plugin to ignore
			mem.tgenSettings['plugins']['ignore'].push(element[1]);
			//writes the changes to tgen.yaml
			fs.writeFileSync(process.env.TGENPATH + '/../.tgen.yaml', yaml.safeDump(mem.tgenSettings));
		}
		if (element[0] === 'check') {
			//check a plugin directory
			try {
				//reads a directory
				var dir = fs.readdirSync(process.env.TGENPATH + '../plugins/' + element[1] + '/');
			} catch (e) {
				//the directory doesn't exist
				console.log(chalk.redBright('error: plugin directory not found: ' + element[1]));
				return 1;
			}
			console.log(chalk.cyanBright('installed plugins: '));

			dir.forEach((ind) => {
				//lists the plugin files
				logger(ind.substring(0, utils.lastOf(ind, '.')), 'default');
			});
		}
	},
	'Get info, install or ignore a plugin.'
);

//set exit status only if we are not in a mocha test, so shells like zsh can visualize the exit code
if (typeof global.it !== 'function') {
	console.log(chalk.greenBright('tgen templating engine version ' + chalk.whiteBright(TGEN_VERSION)));
	const exitStatus = tp.parse();
	//separator
	console.log();
	process.exit(exitStatus);
}

//we are running a mocha test, so we don't exit.
tp.parse();
