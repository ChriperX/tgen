//#region LICENSE

/*
	File used in tgen for template handling.
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
const fs = require('fs');

const utils = require('./utils/utils');

const exec = require('child_process').execSync; //import the exec function, used for executing bash commands


const logger = require('./utils/logger.js');

const plugger = require('@nonamenpm/plugger');

const chalk = require('chalk');

const mem = require('./utils/mem');

let plugins = []; //#region PLUGIN_ENTRY_POINT

exports.use = function (plugins) {
  plugger(plugins, this, false);
};

exports.pluginInfo = {};
exports.pluginList = '';

exports.loadPlugins = function (file) {
  // $FlowFixMe
  walk(process.env.TGENPATH + '../plugins/templateParser/', file);
  exports.use(plugins);
}; //entry point for plugins


exports.templateKeys = {
  create: function (file) {
    const fileToCreate = file;
    const createdDirs = {};

    for (let i = 0; i <= fileToCreate.length - 1; i++) {
      //console.log(mem.replaceVars(fileToCreate[i]));
      if (typeof fileToCreate[i] !== 'object') {
        if (utils.lastOf(fileToCreate[i], '/') !== -1) {
          let parsedFile = mem.replaceVars(fileToCreate[i]); //create the directories

          fs.mkdirSync(parsedFile.substring(0, utils.lastOf(parsedFile, '/')), {
            recursive: true
          });
          createdDirs[parsedFile.substring(0, utils.lastOf(parsedFile, '/'))] || logger('created directory: ' + chalk.whiteBright(parsedFile.substring(0, utils.lastOf(parsedFile, '/'))), 'success');
          /*
          console.log(
          		chalk.greenBright(
          			'	created directory: ' +
          				chalk.whiteBright(parsedFile.substring(0, utils.lastOf(parsedFile, '/')))
          		)
          	);
          			*/

          createdDirs[parsedFile.substring(0, utils.lastOf(parsedFile, '/'))] = true; //if a slash is at the end, assume we aren't creating a file

          if (utils.lastOf(parsedFile, '/') !== parsedFile.length - 1) {
            fs.writeFileSync('./' + parsedFile, '');
            logger('created file: ' + chalk.whiteBright(parsedFile), 'success');
          }
        } else {
          const parsedFile = mem.replaceVars(fileToCreate[i]);
          fs.writeFileSync('./' + parsedFile, '');
        }
      }
    }
  },
  commands: function (file) {
    const commands = file || ['echo'];
    let chainedCommand = '';

    for (let i = 0; i <= commands.length - 1; i++) {
      //exec(commands[i].replace(/\(name\)/g, element));
      chainedCommand += i === commands.length - 1 ? commands[i] : commands[i] + ' && ';
      logger('ran command: ' + chalk.whiteBright(mem.replaceVars(commands[i])), 'info');
    }

    exec(mem.replaceVars(chainedCommand).trim());
    logger('this may take a while', 'warning');
  }
}; //#endregion PLUGIN_ENTRY_POINT
//#region PARSING

exports.loadTemplates = function (element) {
  var file;

  try {
    if ( // $FlowFixMe
    require('../loaders/' + mem.LOADER.fileLoader)(result => {
      file = result;
    }, element[0])) {
      return 1;
    }
  } catch (e) {
    logger('error: loader specified not found.\n', 'error');
    process.exit(1);
  }

  exports.loadPlugins(file);
  console.log(chalk.bold.blueBright('executing template: ' + element[0] + ', ' + (exports.pluginList ? 'with template plugins: ' + chalk.whiteBright(exports.pluginList) : 'with no template plugins installed.')));

  for (let key in file) {
    try {
      exports.templateKeys[key](file[key], element[1], file);
    } catch (e) {
      if (e instanceof TypeError) {
        logger('error: unknown key: ' + chalk.whiteBright("'" + key + "'."), 'error');
      }

      return 1;
    }
  }

  return 0;
}; //#endregion PARSING


function walk(dir, objTree) {
  // $FlowFixMe
  let loader = require('../loaders/' + mem.LOADER.templateLoader);

  function loadFunction(plugins, pluginList) {
    exports.use(plugins);
    exports.pluginList = pluginList;
  }

  if (!objTree) {
    return 1;
  }

  loader(loadFunction, objTree, dir);
}