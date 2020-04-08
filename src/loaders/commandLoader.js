module.exports = function(load: Function, objTree: Object, dir: string) {
	const fs = require('fs');
	const mem = require('../cli/utils/mem');
	const utils = require('../cli/utils/utils');

	let files = fs.readdirSync(dir);
	let plugins: any[] = [];

	files.forEach((element) => {
		if (!mem.tgenSettings['plugins']['ignore'].includes(element.substring(0, utils.lastOf(element, '.')))) {
			// $FlowFixMe
			plugins.push(require(dir + element));
		}
	});
	load(plugins);
};
