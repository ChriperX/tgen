const fs = require('fs');

const logger = require('../../cli/utils/logger.js');

const mem = require('../../cli/utils/mem.js');

const chalk = require('chalk');

exports.pluginInfo = {
  version: 'v1.0.0',
  author: 'NoName',
  repo: '',
  extends: 'write',
  description: 'Append to a file multiple lines.'
};
exports.templateKeys = {
  write: objStructure => {
    // loop through the objects
    for (const key in objStructure) {
      try {
        // check if file path is a directory
        if (Array.isArray(objStructure)) {
          logger('error: expected object in write but found array', 'error');
          return 1;
        }

        if (fs.lstatSync(mem.replaceVars(key)).isDirectory()) {
          logger('error: file is a directory.', 'error');
          return 1;
        }
      } catch (e) {
        logger("error: file doesn't exist.", 'error');
        return 1;
      }

      logger('wrote to file: ' + chalk.whiteBright(key), 'success');

      try {
        fs.appendFileSync(mem.replaceVars(key), objStructure[key] + '\n');
      } catch (e) {
        return 1;
      }
    }
  }
};