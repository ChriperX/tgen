/* @flow */

module.exports = function(load: Function, fileName: string): ?number {
	const fs = require('fs');
	const yaml = require('js-yaml');
	const chalk = require('chalk');
	const error = require('../cli/messages').newMessageType('error');
	const logger = require('../cli/utils/logger');

	try {
		//load file, TGENPATH is the path to where tgen is installed
		// $FlowFixMe
		var extension = fs.existsSync(process.env.TGENPATH + '../templates/' + fileName + '.yaml') ? '.yaml' : '.yml';
		var file = yaml.safeLoad(
			// $FlowFixMe
			fs.readFileSync(process.env.TGENPATH + '../templates/' + fileName + extension, 'utf8')
		); //parse the yaml template
	} catch (e) {
		if (e.name === 'YAMLException') {
			//bad formatting in template
			logger(
				error(chalk.redBright('error: bad formatting in template: '), 'yaml_bad_formatting') +
					chalk.whiteBright(fileName),
				'error'
			);
		} else {
			//template not found
			fileName !== undefined
				? logger(
						error(chalk.redBright('error: template not found: '), 'template_not_found') +
							chalk.whiteBright(fileName),
						'error'
					)
				: logger(error('error: please specify a template.', 'template_not_specified'), 'error');
		}
		return 1;
	}
	load(file);
};
