#!/usr/bin/env node

/* @flow */

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

//we set the TGENPATH env variable to this directory.
//orginally you had to set TGENPATH manually so because i
//didn't want to change every require() in other files, i set
//TGENPATH directly in here

const path = require('path');
process.env.TGENPATH = path.resolve(__dirname) + (process.platform === 'win32' ? '\\' : '/');
const chalk = require('chalk');
const logger = require('./utils/logger');

const template = require('./templates');
const tp = require('@nonamenpm/text-parser');
const fs = require('fs');
const yaml = require('js-yaml');
const utils = require('./utils/utils');
const plugger = require('@nonamenpm/plugger');
const messages = require('./messages.js');
const mem = require('./utils/mem');

const error = messages.newMessageType('error');
const general = messages.newMessageType('general');

const TGEN_VERSION = '1.0.0';
const INFO_NOT_GIVEN = 'not given';

let plugins = [];

//#region PLUGIN_ENTRY_POINT

//entry point for plugins
exports.commands = {};

//object that defines information about a plugin
exports.pluginInfo = {};

exports.use = function(plugin: any[]) {
	plugger(plugin, this, false);
};

function addCustomCommands() {
	for (let key in exports.commands) {
		//loops through the commands object and adds the commands
		tp.add(exports.commands[key]['command'], exports.commands[key]['cb'], exports.commands[key]['desc']);
	}
}

function walk(dir, objTree) {
	// $FlowFixMe
	const loader = require('../loaders/' + mem.LOADER.commandLoader);
	function loadPlugins(plugins: any[]) {
		exports.use(plugins);
	}

	try {
		loader(loadPlugins, objTree, dir);
	} catch (e) {
		logger('error: loader specified not found.\n', 'error');
		process.exit(1);
	}
}

// $FlowFixMe
walk(process.env.TGENPATH + '../plugins/parser/');
exports.use(plugins);
addCustomCommands();

//#endregion PLUGIN_ENTRY_POINT

//creates a new project from a template
exports.newTemplate = function(element: any) {
	mem.newVar(element[1], 'name');

	//we return the exit status
	return template.loadTemplates(element);
};

tp.error((token) => {
	logger(
		error('error: unrecognized token ', 'parser_unrecognized_token') + chalk.whiteBright("'" + token + "'."),
		'error'
	);
});

tp.add(
	'verbose',
	() => {
		mem.newVar(true, 'verbose');
	},
	'Enable verbose logging.'
);

tp.add(
	'suppress',
	() => {
		mem.newVar(true, 'suppress');
	},
	'Suppresses info and success logs.'
);

//add the new command, with template and name
tp.add('new <template> <name>', exports.newTemplate, 'Create new project from template.');

//alias for new
tp.add('exec <template> <name>', exports.newTemplate, 'Alias of new.');

tp.add(
	'plugin <option> <pluginName>',
	(element) => {
		if (element[0] === 'info') {
			//load the plugins, if i don't do this the plugins will never load
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
				//console.log(process.env.TGENPATH);
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
			// $FlowFixMe
			fs.writeFileSync(process.env.TGENPATH + '/../.tgen.yaml', yaml.safeDump(mem.tgenSettings));
		}
		if (element[0] === 'check') {
			//check a plugin directory
			try {
				//reads a directory
				// $FlowFixMe
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

tp.add('use <loaderName> <newLoader>', (element) => {
	logger(
		'using loader ' +
			chalk.bold.whiteBright("'" + element[1] + "' ") +
			'for ' +
			chalk.bold.whiteBright("'" + element[0] + "'"),
		'info'
	);
	// $FlowFixMe
	if (!fs.existsSync(process.env.TGENPATH + '../loaders/' + element[1])) {
		logger("error: loader file specified doesn't exist.", 'error');
		return 1;
	}
	mem.tgenSettings.loaders[element[0]] = element[1];
	// $FlowFixMe
	fs.writeFileSync(process.env.TGENPATH + '/../.tgen.yaml', yaml.safeDump(mem.tgenSettings));
});

//set exit status only if we are not in a mocha test, so shells like zsh can visualize the exit code
if (typeof global.it !== 'function') {
	console.log(
		general(chalk.bold.greenBright('tgen templating engine version '), 'tgen_version') +
			chalk.whiteBright(TGEN_VERSION)
	);
	const exitStatus = tp.parse();
	//separator
	process.platform === 'win32' || console.log();
	process.exit(exitStatus);
}

//we are running a mocha test, so we don't exit.
mem.newVar(true, 'suppressAll');
tp.parse();
