
//#region LICENSE

/*
	Log plugin for tgen, the open source templating engine.
    Copyright (C) 2020 Christian

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

//#endregion LICENSE


const chalk = require('chalk');

const logLevels = {
	default: function(msg, name) {
		console.log(chalk.whiteBright('	' + msg.replace(/\(name\)/g, name)));
	},
	info: function(msg, name) {
		console.log('	' + chalk.cyanBright(msg.replace(/\(name\)/g, name)));
	},
	error: function(msg, name) {
		console.log('	' + chalk.redBright(msg.replace(/\(name\)/g, name)));
	},
	warning: function(msg, name) {
		console.log('	' + chalk.yellowBright(msg.replace(/\(name\)/g, name)));
	},
	success: function(msg, name) {
		console.log('	' + chalk.greenBright(msg.replace(/\(name\)/g, name)));
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
					logLevels[key](file[key][i], name);
				}
			}
		} catch (e) {
			console.log(chalk.redBright('	error: logs must be in a logLevel sub-key.'));
			return 1;
		}
	}
};
