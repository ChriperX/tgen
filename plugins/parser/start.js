const index = require('../../src/index.js')

exports.commands = {
  start: {
    command: 'start <template> <name>',
    cb: (element) => {
      index.newTemplate(element)
    },
    desc: 'Alias of new'
  }
}
