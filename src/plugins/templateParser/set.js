/* @flow */

// plugin used to create variables inside a template.
const mem = require('../../cli/utils/mem.js');

exports.pluginInfo = {
	set: {
		version: 'v1.0.0',
		author: 'NoName',
		repo: '',
		extends: 'set',
		description: 'Adds a variable.'
	}
};

exports.templateKeys = {
	set: (objStructure: Object) => {
		for (const key in objStructure) {
			if (typeof objStructure[key] === 'object') {
				for (let i in objStructure[key]) {
					//mem.newVar(mem.replaceVars(objStructure[key][i]), key);
					objStructure[key][i] = mem.replaceVars(objStructure[key][i]);
				}
			} else {
				mem.replaceVars(objStructure[key]);
			}
			mem.newVar(objStructure[key], key);
		}
	}
};
