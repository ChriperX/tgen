const mem = require('../../src/utils/mem.js');
const logger = require('../../src/utils/logger.js');
const chalk = require('chalk');
const cli_prompt = require('prompt-sync')({
	sigint: true
});

//plugin info
exports.pluginInfo = {
	prompt: {
		version: 'v1.0.0',
		author: 'NoName',
		repo: '',
		extends: 'prompt',
		description: 'Get user input from command line.'
	}
};

//functions
exports.templateKeys = {
	prompt: function(file) {
		try {
			for (let key in file) {
				//process.stdout.moveCursor(8, 0);

				logger(key, 'external');
				mem.newVar(cli_prompt('	' + chalk.magentaBright('$') + ' '), file[key]);
			}
		} catch (e) {
			//console.log(e);
		}
	}
};
