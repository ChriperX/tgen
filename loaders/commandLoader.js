module.exports = function (load, objTree, dir) {
  const fs = require('fs');

  const mem = require('../cli/utils/mem');

  const utils = require('../cli/utils/utils');

  let files = fs.readdirSync(dir);
  let plugins = [];
  files.forEach(element => {
    if (!mem.tgenSettings['plugins']['ignore'].includes(element.substring(0, utils.lastOf(element, '.')))) {
      // $FlowFixMe
      plugins.push(require(dir + element));
    }
  });
  load(plugins);
};