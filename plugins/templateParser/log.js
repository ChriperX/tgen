// #region LICENSE

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

// #endregion LICENSE

// const chalk = require('chalk');
const logger = require('../../src/utils/logger')
const mem = require('../../src/utils/mem.js')

exports.pluginInfo = {
  log: {
    version: 'v1.0.0',
    author: 'NoName',
    repo: 'none',
    extends: 'log, logLevel',
    description: 'Log functionality for templates.'
  }
}

exports.templateKeys = {
  log: function (file, name) {
    for (const key in file) {
      for (let i = 0; i <= file[key].length - 1; i++) {
        // logLevels[key](file[key][i], name);
        logger(file[key][i], key)
      }
    }
  }
}
