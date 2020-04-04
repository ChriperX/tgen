// #region LICENSE

/*
	Logic plugin for tgen, the open source templating engine.
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
const template = require('../../lib/templates.js');

const chalk = require('chalk');

const mem = require('../../lib/utils/mem.js');

const logger = require('../../lib/utils/logger.js');

var lastEval = [];
var currKey = [];

function safeEval(expr) {
  // we don't evaluate with eval() because it opens attack vectors for malicious templates
  return Function("'use strict'; return(" + expr + ')')();
}

exports.pluginInfo = {
  if: {
    version: 'v1.0.0',
    author: 'NoName',
    repo: 'none',
    extends: 'if',
    description: 'Adds if logic to templates.'
  },
  else: {
    version: 'v1.0.0',
    author: 'NoName',
    repo: 'none',
    extends: 'else',
    description: 'Adds else logic to templates.'
  },
  logic: {
    version: 'v1.0.0',
    author: 'NoName',
    repo: 'none',
    extends: 'if, else',
    description: 'Adds if else logic to templates.'
  }
};
exports.templateKeys = {
  if: function (file, name, fileStructure) {
    // variable used to maintain track of at wwhich if statement we are at
    if (typeof mem.fetch('if_count') === 'object') {
      mem.newVar(0, 'if_count');
    } else {
      mem.newVar(mem.fetch('if_count') + 1, 'if_count');
    } // create 2d array
    // this will be used with if count to execute the various else statements
    // only if the corresponding if and the corresponding conditions are met


    lastEval[mem.fetch('if_count')] = [];

    for (let i = 0; i <= file.length - 1; i++) {
      for (const key in file[i]) {
        var constKey = key; // if i don't do this js freaks out
        // push to currKey the next else statement, if there are any

        fileStructure.else ? currKey.push(fileStructure.else) : '';

        try {
          // evaluate the condition
          var evaluation = safeEval(mem.replaceVars(key));
        } catch (e) {
          // there may be a reference error or an indentation error in the template
          logger('error: error while evaluating if condition.\n	maybe there is an indentation error?', 'error');
          return 1;
        }

        if (evaluation) {
          // this is where we execute the syntax inside the if
          fileStructure.else ? lastEval[mem.fetch('if_count')].push(true) : '';

          for (const key2 in file[i][constKey]) {
            try {
              let previous = mem.fetch('if_count');
              template.templateKeys[key2](file[i][constKey] ? file[i][constKey][key2] : file[i][key2], name, file[i][constKey]);
              mem.newVar(previous, 'if_count');
            } catch (e) {
              // console.log(e);
              // there may be an inexistent key or an indentation error
              logger('error: unknown key: ' + chalk.whiteBright("'" + key2 + "'.") + '\n	maybe there is an indentation error?', 'error');
              return 1;
            }
          }
        } else {
          // if the evaluation is false, we push to the current if a false flag, only if there are any elses
          fileStructure.else ? lastEval[mem.fetch('if_count')].push(false) : '';
        }
      }
    }
  },
  else: function (file, name, fileStructure) {
    // get the current file or currKey if it exists
    file = currKey[currKey.length - 1] || file;

    for (let i = 0; i <= file.length - 1; i++) {
      // check if any of the last if's conditions are false
      if (lastEval[mem.fetch('if_count')][i] === false) {
        // we take out of memory the last else statement
        currKey.pop();

        try {
          for (const key in file[i]) {
            template.templateKeys[key](file[i][key], name, fileStructure.else);
          }
        } catch (e) {
          // console.log(e);
          logger('error: unknown key: ' +
          /* eslint no-undef: */
          chalk.whiteBright("'" + key2 + "'.") + '\n	maybe there is an indentation error?', 'error');
          return 1;
        }
      }
    }
  }
};