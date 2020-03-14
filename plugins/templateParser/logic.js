//#region LICENSE

/*
	Logic plugin for tgen, the open source templating engine.
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

const template = require('../../src/templates.js');
const chalk = require('chalk');

var lastEval = [];
var currKey = [];

function safeEval(expr) {
	return Function("'use strict'; return(" + expr + ')')();
}

exports.pluginInfo = {
	if: {
		version: 'v1.0.0',
		author: 'NoName',
		repo: 'none',
		extends: 'if',
		description: 'Adds if logic to templates.'
	},
	else: {
		version: 'v1.0.0',
		author: 'NoName',
		repo: 'none',
		extends: 'else',
		description: 'Adds else logic to templates.'
	},
	logic: {
		version: 'v1.0.0',
		author: 'NoName',
		repo: 'none',
		extends: 'if, else',
		description: 'Adds if else logic to templates.'
	}
};

exports.templateKeys = {
	if: function(file, name, fileStructure) {
		for (key in file) {
			var constKey = key; //if i don't do this js freaks out

			fileStructure['else'] ? currKey.push(fileStructure['else']) : '';

			if (safeEval(key.replace(/\(name\)/g, name))) {
				for (key2 in file[constKey]) {
					try {
						template.templateKeys[key2](
							file[constKey] ? file[constKey][key2] : file[key2],
							name,
							file[constKey]
						);
					} catch (e) {
						console.log(
							chalk.redBright('	error: unsupported key: ') + chalk.whiteBright("'" + key2 + "'.")
						);

						return 1;
					}
				}
			} else {
				fileStructure['else'] ? lastEval.push(false) : '';
			}
		}
	},
	else: function(file, name, fileStructure) {
		file = currKey[currKey.length - 1] || file;
		if (lastEval[lastEval.length - 1] === false) {
			lastEval.pop();
			currKey.pop();
			try {
				for (key in file) {
					template.templateKeys[key](file[key], name, fileStructure['else']);
				}
			} catch (e) {
				console.log(e);
				console.log(chalk.redBright('	error: unsupported key: ') + chalk.whiteBright("'" + key + "'."));
				return 1;
			}
		}
	}
};
