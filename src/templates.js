const tp = require('@nonamenpm/text-parser');
const yaml = require('js-yaml');
const fs = require('fs');
const utils = require('./utils/utils');

exports.templates = function() {
	tp.add('new <template> <name>', (element) => {
		const exec = require('child_process').exec;
		const file = yaml.safeLoad(fs.readFileSync('./templates/' + element[0] + '.yaml', 'utf8'));
		const commands = file['commands'] || [ 'echo' ];
		const fileToCreate = file['create'];

		for (let i = 0; i <= fileToCreate.length - 1; i++) {
			console.log(fileToCreate[i].replace(/\(name\)/g, element[1]));
			if (typeof fileToCreate[i] !== 'object') {
				if (utils.lastOf(fileToCreate[i], '/') !== -1) {
					const parsedFile = fileToCreate[i].replace(/\(name\)/g, element[1]);

					fs.mkdir(parsedFile.substring(0, utils.lastOf(parsedFile, '/') + 1), () => {});
					fs.writeFile('./' + parsedFile, '', () => {});
				}
			}
		}

		for (let i = 0; i <= commands.length - 1; i++) {
			exec(commands[i].replace(/\(name\)/g, element[1]));
		}
	});
	tp.parse();
};
