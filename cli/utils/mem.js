// #region LICENSE

/*
	File used for costant memory across files for tgen, the open source templating engine.
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
// file used for costant memory across files
const yaml = require('js-yaml');

const fs = require('fs');

const vars = {}; // $FlowFixMe

exports.tgenSettings = yaml.safeLoad(fs.readFileSync(process.env.TGENPATH + '../.tgen.yaml', 'utf8')) || {
  plugins: {
    ignore: []
  },
  loaders: {
    templateKeys: 'pluginLoader.js',
    fileLoader: 'fileLoader.js',
    commandLoader: 'commandLoader.js'
  }
};
exports.LOADER = {
  templateLoader: exports.tgenSettings.loaders.templateKeys,
  fileLoader: exports.tgenSettings.loaders.fileLoader,
  commandLoader: exports.tgenSettings.loaders.commandLoader
};

exports.newVar = function (content, varName) {
  // prettier-ignore
  if (!exports.containsVar('${{' + varName + '}}')) {
    throw new SyntaxError('Invalid character in var name: \'' + varName + '\'.');
  } //prettier-ignore


  vars['\\$\\{\\{' + varName + '\\}\\}'] = content; // $FlowFixMe

  return content;
};

exports.fetch = function (varName = '') {
  // prettier-ignore
  return vars['\\$\\{\\{' + varName + '\\}\\}'] !== undefined ? vars['\\$\\{\\{' + varName + '\\}\\}'] : vars;
};

exports.replaceVars = function (string) {
  let returnString = string;

  for (let key in vars) {
    returnString = returnString.replace(new RegExp(key, 'g'), vars[key]);
  }

  return returnString;
};

exports.containsVar = function (string) {
  /*eslint no-unneeded-ternary:*/
  //return string.match(/\$\{\{_?[a-zA-Z-]*\}\}/g) ? true : false;
  return string.match(/\$\{\{\s*[a-zA-Z_0-9]+\s*\}\}/g) ? true : false;
};

exports.newVar(false, 'suppress');
exports.newVar(false, 'verbose');
exports.newVar(false, 'suppressAll');