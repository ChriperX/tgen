const chalk = require('chalk');

const logLevels = {
	default: function(msg) {
		console.log(chalk.whiteBright('	' + msg));
	},
	info: function(msg) {
		console.log('sadsadsafsafsafsafasgsa');
		console.log(chalk.cyanBright('	INFO: ') + chalk.whiteBright(msg));
	},
	error: function(msg) {
		console.log(chalk.redBright('	ERROR: ' + msg));
	},
	success: function(msg) {
		console.log(chalk.greenBright('	SUCCESS: ' + msg));
	}
};

exports.pluginInfo = {
	log: {
		version: 'v1.0.0',
		author: 'NoName',
		repo: 'none',
		extends: 'log, logLevel',
		description: 'Log functionality for templates.'
	}
};

exports.templateKeys = {
	log: function(file, name) {
		try {
			for (key in file) {
				for (let i = 0; i <= file[key].length - 1; i++) {
					logLevels[key](file[key][i]);
				}
			}
		} catch (e) {
			console.log(chalk.redBright('	error: logs must be in a logLevel sub-key.'));
		}
	}
};
