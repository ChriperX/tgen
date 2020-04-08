/* @flow */

module.exports = function(load: Function, objTree: Object, dir: string) {
	const fs = require('fs');
	const chalk = require('chalk');
	const mem = require('../cli/utils/mem');
	const logger = require('../cli/utils/logger');
	const utils = require('../cli/utils/utils');

	let files = fs.readdirSync(dir);
	let count = 0;
	let plugins: any[] = [];

	exports.pluginList = '';

	if (!objTree['use']) {
		files.forEach((element) => {
			if (count === 4) {
				exports.pluginList += chalk.bold.blueBright(
					'and ' +
						String(files.length - count) +
						(files.length - count === 1 ? ' more plugin.' : ' more plugins.')
				);
			}
			if (!mem.tgenSettings['plugins']['ignore'].includes(element.substring(0, utils.lastOf(element, '.')))) {
				if (count < 4) {
					exports.pluginList +=
						element.substring(0, utils.lastOf(element, '.')) +
						(files[files.length - 1] !== element ? ', ' : '.');
				}
				// $FlowFixMe
				plugins.push(require(dir + element));
			}
			count++;
		});
	} else if (objTree['use']) {
		//load the use key, if objTree is undefined we return an empty array
		files = objTree ? objTree['use'] : [];

		//loop through the array, and load the plugins
		// $FlowFixMe
		files.forEach((element) => {
			//user is trying directory traversal
			if (element.includes('/')) {
				element = element.substring(utils.lastOf(element, '/') + 1);
			}

			//check if file exists
			if (!fs.existsSync(dir + element + '.js')) {
				logger('error: plugin not found: ' + chalk.whiteBright(element), 'error');
				//separator
				process.platform === 'win32' || console.log();
				process.exit(1);
			}

			if (count === 4) {
				exports.pluginList += chalk.bold.blueBright(
					'and ' +
						String(files.length - count) +
						(files.length - count === 1 ? ' more plugin.' : ' more plugins.')
				);
			}

			if (count < 4) {
				exports.pluginList += element + (files[files.length - 1] !== element ? ', ' : '.');
			}
			// $FlowFixMe
			plugins.push(require(dir + element + '.js'));

			count++;
		});
		// $FlowFixMe
		objTree ? delete objTree['use'] : '';
	}

	load(plugins, exports.pluginList);
};
