#!/usr/bin/env node
const template = require('./templates');
const tp = require('@nonamenpm/text-parser');
const fs = require('fs');
const plugger = require('@nonamenpm/plugger');

//logLevel for logger
let logLevel = '';
let plugins = [];

//#region PLUGIN_ENTRY_POINT

//entry point for plugins
exports.commands = {};

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

walk('../plugins/parser/');
exports.use(plugins);
addCustomCommands();

//#endregion PLUGIN_ENTRY_POINT

//add the new command, with template and name
tp.add('new <template> <name>', (element) => {
	template.loadTemplates(element, logLevel);
});

tp.add('-v --verbose', () => {
	logLevel = 'verbose';
});

tp.parse();
