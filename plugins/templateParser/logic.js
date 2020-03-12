var lastEval = [];
const template = require('../../src/templates.js');
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
	}
};

exports.templateKeys = {
	if: function(file, name, fileStructure) {
		for (key in file) {
			fileStructure['else'] ? currKey.push(fileStructure['else']) : '';

			if (safeEval(key)) {
				for (key2 in file[key]) {
					try {
						template.templateKeys[key2](file[key] ? file[key][key2] : file[key2], name, file[key]);
					} catch (e) {
						console.log(chalk.redBright('	error: unsupported key: ') + chalk.whiteBright("'" + key + "'."));

						return 1;
					}
				}
			} else {
				fileStructure['else'] ? lastEval.push(false) : '';
				continue;
			}
		}
	},
	else: function(file, name) {
		file = currKey[currKey.length - 1] || file;

		if (lastEval[lastEval.length - 1] === false) {
			try {
				for (key in file) {
					template.templateKeys[key](file[key], name);
				}
			} catch (e) {
				console.log(chalk.redBright('	error: unsupported key: ') + chalk.whiteBright("'" + key + "'."));
				return 1;
			}
		}
		lastEval.pop();
		currKey.pop();
	}
};
