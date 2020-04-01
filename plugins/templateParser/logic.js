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
const mem = require('../../src/utils/mem.js');
const logger = require('../../src/utils/logger.js');

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
		//mem.fetch('if-count') ? mem.newVar(0, 'if-count') : mem.newVar(mem.fetch('if-count') + 1, 'if-count');
		if (typeof mem.fetch('if-count') === 'object') {
			mem.newVar(0, 'if-count');
		} else {
			mem.newVar(mem.fetch('if-count') + 1, 'if-count');
		}

		lastEval[mem.fetch('if-count')] = [];

		for (let i = 0; i <= file.length - 1; i++) {
			for (let key in file[i]) {
				var constKey = key; //if i don't do this js freaks out

				fileStructure['else'] ? currKey.push(fileStructure['else']) : '';

				try {
					var evaluation = safeEval(mem.replaceVars(key));
				} catch (e) {
					logger(
						'error: error while evaluating if condition.\n	maybe there is an indentation error?',
						'error'
					);
					return 1;
				}

				if (evaluation) {
					fileStructure['else'] ? lastEval[mem.fetch('if-count')].push(true) : '';
					for (let key2 in file[i][constKey]) {
						try {
							template.templateKeys[key2](
								file[i][constKey] ? file[i][constKey][key2] : file[i][key2],
								name,
								file[i][constKey]
							);
						} catch (e) {
							//console.log(e);

							logger(
								'error: unsupported key: ' +
									chalk.whiteBright("'" + key2 + "'.") +
									'\n	maybe there is an indentation error?',
								'error'
							);

							return 1;
						}
					}
				} else {
					fileStructure['else'] ? lastEval[mem.fetch('if-count')].push(false) : '';
				}
			}
		}
	},
	else: function(file, name, fileStructure) {
		file = currKey[currKey.length - 1] || file;
		for (let i = 0; i <= file.length - 1; i++) {
			if (lastEval[mem.fetch('if-count')][i] === false) {
				currKey.pop();
				try {
					for (let key in file[i]) {
						template.templateKeys[key](file[i][key], name, fileStructure['else']);
					}
				} catch (e) {
					console.log(e);

					console.log(chalk.redBright('	error: unsupported key: ') + chalk.whiteBright("'" + key + "'."));
					return 1;
				}
			}
		}
	}
};
