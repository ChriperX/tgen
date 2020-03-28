//#region LICENSE

/*
	Logger library for tgen, the open source templating engine.
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
const mem = require('./mem');

const levelCodes = {
	none: function(msg) {
		mem.fetch('suppressAll') || console.log('	' + msg);
	},
	external: function(msg) {
		mem.fetch('suppressAll') || console.log(chalk.yellowBright('	' + msg));
	},
	default: function(msg) {
		mem.fetch('suppressAll') || console.log(chalk.whiteBright('	' + msg));
	},
	info: function(msg) {
		//log only if suppress is false
		mem.fetch('suppress') || mem.fetch('suppressAll') || console.log(chalk.cyanBright('	' + msg));
	},
	success: function(msg) {
		mem.fetch('suppress') || mem.fetch('suppressAll') || console.log(chalk.greenBright('	' + msg));
	},
	warning: function(msg) {
		mem.fetch('suppressAll') || console.log(chalk.yellowBright('	' + msg));
	},
	error: function(msg) {
		mem.fetch('suppressAll') || console.log(chalk.redBright('	' + msg));
	},
	verbose: function(msg) {
		!mem.fetch('verbose') || mem.fetch('suppressAll') || console.log(chalk.green('	' + msg));
	}
};

module.exports = function(msg, levelCode) {
	try {
		//try calling a logLevel function
		levelCodes[levelCode](mem.replaceVars(msg));
	} catch (e) {
		//if the specified logLevel is not defined return 1
		console.log(chalk.redBright('	error: levelCode not found: ' + levelCode));
		return 1;
	}
	//return 0 the message and the level code
	return [ 0, msg, levelCode ];
};
