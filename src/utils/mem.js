//file used for costant memory across files
const yaml = require('js-yaml');
const fs = require('fs');

exports.tgenSettings = yaml.safeLoad(fs.readFileSync(process.env.TGENPATH + '../.tgen.yaml', 'utf8'));
