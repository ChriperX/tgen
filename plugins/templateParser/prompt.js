const mem = require('../../src/utils/mem.js')
const logger = require('../../src/utils/logger.js')
const chalk = require('chalk')
const cli_prompt = require('prompt-sync')({
  sigint: true
})

// plugin info
exports.pluginInfo = {
  prompt: {
    version: 'v1.0.0',
    author: 'NoName',
    repo: '',
    extends: 'prompt',
    description: 'Get user input from command line.'
  }
}

// functions
exports.templateKeys = {
  prompt: function (file) {
    try {
      for (const key in file) {
        // process.stdout.moveCursor(8, 0);
        logger(key, 'default')
        mem.newVar(cli_prompt('	' + chalk.greenBright('$') + ' '), file[key])
      }
    } catch (e) {
      // console.log(e);
    }
  }
}
