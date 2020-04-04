/* @flow */

// #region LICENSE

/*
	Modifiable messages for tgen, the open source templating engine.
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

// #endregion LICENSE
const plugger = require('@nonamenpm/plugger');
const fs = require('fs');

const plugins: any[] = [];

function walk(dir) {
	let files = fs.readdirSync(dir);
	files.forEach((element) => {
		// $FlowFixMe
		plugins.push(require(dir + element));
	});
}

// $FlowFixMe
walk(process.env.TGENPATH + '../plugins/messages/');

// entry point that will be used by plugin to make custom messages for tgen
exports.logMessages = {};

exports.newMessageType = (msgType: string): Function => (msg: any, id: string): any => {
	return exports.logMessages[msgType]
		? exports.logMessages[msgType][id] ? exports.logMessages[msgType][id] : msg
		: msg;
};

exports.use = function(plugin: any[]) {
	plugger(plugin, this, false);
};

exports.use(plugins);
