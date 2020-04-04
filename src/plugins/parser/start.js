/* @flow */

const index = require('../../cli/index.js');

exports.commands = {
	start: {
		command: 'start <template> <name>',
		cb: (element: any) => {
			index.newTemplate(element);
		},
		desc: 'Alias of new'
	}
};
