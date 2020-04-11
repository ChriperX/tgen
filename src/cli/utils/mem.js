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

/* @flow */
/*eslint prefer-regex-literals:*/
/*eslint  dot-location:*/

// file used for costant memory across files
const yaml = require('js-yaml');
const fs = require('fs');

const vars = {};
const internalVars = {};

// $FlowFixMe
exports.tgenSettings = yaml.safeLoad(fs.readFileSync(process.env.TGENPATH + '../.tgen.yaml', 'utf8')) || {
	plugins: { ignore: [] },
	loaders: {
		templateKeysLoader: 'pluginLoader.js',
		templateLoader: 'templateLoader.js',
		commandLoader: 'commandLoader.js'
	}
};

exports.LOADER = {
	templateLoader: exports.tgenSettings.loaders.templateKeysLoader,
	fileLoader: exports.tgenSettings.loaders.templateLoader,
	commandLoader: exports.tgenSettings.loaders.commandLoader
};

exports.newVar = function(content: ?any, varName: string): string | typeof undefined {
	// prettier-ignore
	if (!exports.containsVar('${{' + varName + '}}')) {
		throw new SyntaxError('Invalid character in var name: \'' + varName + '\'.')
	}
	/*

	! Variable types don't seem to work, so for now i'm not implementing it

	if (type === 'internal') {
		internalVars['\\$\\{\\{' + varName + '\\}\\}'] = content;
	} else if (!type || (type === 'variable' && type !== 'internal')) {
		//prettier-ignore
		vars['\\$\\{\\{' + varName.replace(/\s/g, '') + '\\}\\}'] = content;
	}
	*/

	/*
	TODO

	if (type === VarTypes.CONSTANT) {
		constants[]
	}
	*/

	let newContent: typeof content = content;

	vars['\\$\\{\\{' + varName.replace(/\s/g, '') + '\\}\\}'] = newContent;

	// $FlowFixMe
	return content;
};

exports.fetch = function(varName: string, type: ?string): any | typeof undefined {
	if (!type || type === 'variable') {
		return vars[
			'\\$\\{\\{' + varName.replace(/\s/g, '') + '\\}\\}'
		]; /*!== undefined
			? vars['\\$\\{\\{' + varName.replace(/\s/g, '') + '\\}\\}']
			: undefined;*/
	} else if (type === 'internal') {
		return internalVars[
			'\\$\\{\\{' + varName.replace(/\s/g, '') + '\\}\\}'
		]; /* !== undefined
			? internalVars['\\$\\{\\{' + varName.replace(/\s/g, '') + '\\}\\}']
			: undefined;*/
	}
};

exports.replaceVarsWithStrings = function(string: ?any): any | typeof undefined {
	let returnString = string;
	if (exports.containsVar(string)) {
		for (let key in vars) {
			//the keys in vars are stored like this: \$\{\{VAR_NAME\}\}.
			//So we have to replace the brackets with nothing, otherwise
			//the regex will not work
			if (Array.isArray(vars[key])) {
				//we format correctly the vars that are strings
				for (let i in vars[key]) {
					if (typeof vars[key][i] === 'string') {
						// $FlowFixMe
						vars[key][i] = "'" + vars[key][i] + "'";
					}
				}
				let parsedKey = key.replace('\\$\\{\\{', '').replace('\\}\\}', '');
				//adds brackets so users can reference indexes in an object
				returnString = returnString.replace(
					new RegExp('\\$\\{\\{\\s*' + parsedKey + '\\s*\\}\\}', 'g'),
					'[' + vars[key] + ']'
				);
			} else if (typeof vars[key] === 'object') {
				let parsedKey = key.replace('\\$\\{\\{', '').replace('\\}\\}', '');
				//we stringify to add curly braces
				returnString = returnString.replace(
					new RegExp('\\$\\{\\{\\s*' + parsedKey + '\\s*\\}\\}', 'g'),
					JSON.stringify(vars[key])
				);
			} else {
				let parsedKey = key.replace('\\$\\{\\{', '').replace('\\}\\}', '');
				returnString = returnString.replace(
					new RegExp('\\$\\{\\{\\s*' + parsedKey + '\\s*\\}\\}', 'g'),
					vars[key]
				);
			}
		}
	}
	if (typeof string === 'string') {
		// $FlowFixMe
		returnString = "'" + string + "'";
	}

	//vars['\\$\\{\\{' + varName.replace(/\s/g, '') + '\\}\\}'] = newContent;

	// $FlowFixMe
	return returnString;
};

exports.replaceVars = function(string: string): string {
	let returnString = string;
	if (exports.containsVar(string)) {
		for (let key in vars) {
			//the keys in vars are stored like this: \$\{\{VAR_NAME\}\}.
			//So we have to replace the brackets with nothing, otherwise
			//the regex will not work
			if (Array.isArray(vars[key])) {
				let parsedKey = key.replace('\\$\\{\\{', '').replace('\\}\\}', '');
				//adds brackets so users can reference indexes in an object
				returnString = returnString.replace(
					new RegExp('\\$\\{\\{\\s*' + parsedKey + '\\s*\\}\\}', 'g'),
					'[' + vars[key] + ']'
				);
			} else if (typeof vars[key] === 'object') {
				let parsedKey = key.replace('\\$\\{\\{', '').replace('\\}\\}', '');
				//we stringify to add curly braces
				returnString = returnString.replace(
					new RegExp('\\$\\{\\{\\s*' + parsedKey + '\\s*\\}\\}', 'g'),
					JSON.stringify(vars[key])
				);
			} else {
				let parsedKey = key.replace('\\$\\{\\{', '').replace('\\}\\}', '');
				returnString = returnString.replace(
					new RegExp('\\$\\{\\{\\s*' + parsedKey + '\\s*\\}\\}', 'g'),
					vars[key]
				);
			}
		}
		//returnString = returnString.replace(/\$\{\{\s*/g, '').replace(/\s*\}\}/g, '');
	}

	return returnString;
};

exports.containsVar = function(string: string): boolean {
	/*eslint no-unneeded-ternary:*/

	if (typeof string !== 'string') {
		return false;
	}
	//return string.match(/\$\{\{_?[a-zA-Z-]*\}\}/g) ? true : false;
	return string.match(/\$\{\{\s*[a-zA-Z_][a-zA-Z_0-9]*\s*\}\}/g) ? true : false;
};

exports.newVar(false, 'suppress');
exports.newVar(false, 'verbose');
exports.newVar(false, 'suppressAll');
