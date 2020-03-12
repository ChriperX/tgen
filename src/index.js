#!/usr/local/bin/node
const template = require('./templates');
const tp = require('@nonamenpm/text-parser');
const fs = require('fs');
const chalk = require('chalk');
const yaml = require('js-yaml');
const utils = require('./utils/utils');
const plugger = require('@nonamenpm/plugger');
const mem = require('./utils/mem');

//logLevel for logger
let logLevel = '';
let plugins = [];

//#region PLUGIN_ENTRY_POINT

//entry point for plugins
exports.commands = {};

exports.pluginInfo = {};

exports.use = function(plugin) {
	plugger(plugin, this, false);
};

function addCustomCommands() {
	for (key in exports.commands) {
		tp.add(exports.commands[key]['command'], exports.commands[key]['cb'], exports.commands[key]['desc']);
	}
}

function walk(dir) {
	files = fs.readdirSync(dir);
	files.forEach((element) => {
		plugins.push(require(dir + element));
	});
}

walk(process.env.TGENPATH + '../plugins/parser/');
exports.use(plugins);
addCustomCommands();

//#endregion PLUGIN_ENTRY_POINT

//add the new command, with template and name
tp.add('new <template> <name>', (element) => {
	console.log(
		chalk.cyanBright(
			'executing template: ' +
				element[0] +
				', ' +
				(template.pluginList
					? 'with template plugins: ' + chalk.whiteBright(template.pluginList)
					: 'with no template plugins installed.')
		)
	);
	template.loadTemplates(element, logLevel);
});

tp.add('plugin <option> <pluginName>', (element) => {
	if (element[0] === 'info') {
		if (exports.pluginInfo[element[1]]) {
			console.log(chalk.cyan('info about plugin ') + chalk.whiteBright(element[1]) + ':');
			console.log(chalk.cyan('	version: ') + chalk.whiteBright(exports.pluginInfo[element[1]]['version']));
			console.log(chalk.cyan('	author: ') + chalk.whiteBright(exports.pluginInfo[element[1]]['author']));
			console.log(chalk.cyan('	repo: ') + chalk.whiteBright(exports.pluginInfo[element[1]]['repo']));
			console.log(chalk.cyan('	extends: ') + chalk.whiteBright(exports.pluginInfo[element[1]]['extends']));
			console.log(
				chalk.cyan('	description: ') + chalk.whiteBright(exports.pluginInfo[element[1]]['description'])
			);
		} else if (template.pluginInfo[element[1]]) {
			console.log(chalk.cyan('info about plugin ') + chalk.whiteBright(element[1] + ':'));
			console.log(chalk.cyan('	version: ') + chalk.whiteBright(template.pluginInfo[element[1]]['version']));
			console.log(chalk.cyan('	author: ') + chalk.whiteBright(template.pluginInfo[element[1]]['author']));
			console.log(chalk.cyan('	repo: ') + chalk.whiteBright(template.pluginInfo[element[1]]['repo']));
			console.log(chalk.cyan('	extends: ') + chalk.whiteBright(template.pluginInfo[element[1]]['extends']));
			console.log(
				chalk.cyan('	description: ') + chalk.whiteBright(template.pluginInfo[element[1]]['description'])
			);
		} else {
			console.log(chalk.redBright('error: non-existent plugin: ') + chalk.whiteBright(element[1]));
			return 1;
		}
	}
	if (element[0] === 'ignore') {
		console.log(chalk.cyanBright('ignoring plugin: ' + element[1]));
		mem.tgenSettings['plugins']['ignore'].push(element[1]);
		fs.writeFileSync(process.env.TGENPATH + '/../.tgen.yaml', yaml.safeDump(mem.tgenSettings));
	}
	if (element[0] === 'check') {
		const dir = fs.readdirSync(process.env.TGENPATH + '../plugins/' + element[1] + '/');

		console.log(chalk.cyanBright('installed plugins: '));

		dir.forEach((ind) => {
			console.log(chalk.whiteBright('	' + ind.substring(0, utils.lastOf(ind, '.'))));
		});
	}
});

tp.add('-v --verbose', () => {
	logLevel = 'verbose';
});

tp.parse();

//final separator
console.log();
