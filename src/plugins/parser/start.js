const index = require('../../lib/index.js');

exports.commands = {
	start: {
		command: 'start <template> <name>',
		cb: (element) => {
			index.newTemplate(element);
		},
		desc: 'Alias of new'
	}
};
