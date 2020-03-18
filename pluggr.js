const merge = require('lodash.merge');

module.exports = function(plugin = [], reference, override = false) {
	try {
		//plugin = plugin.split(' '); //split plugins so you don't require multiple calls
		//plugin: array of the plugins to import

		for (var i = 0; i <= plugin.length - 1; i++) {
			var plug = plugin[i];

			//loop through the object that require() returns
			for (key in plug) {
				//if there is another isnstance of the value it merges it to avoid overriding
				if (reference[key] && !override) {
					reference[key] = merge(reference[key], plug[key]);
				} else {
					reference[key] = plug[key];
				}
			}
		}
	} catch (e) {
		return 1;
	}
};
