//file used for costant memory across files
const yaml = require('js-yaml');
const fs = require('fs');

exports.tgenSettings = yaml.safeLoad(fs.readFileSync('../.tgen.yaml', 'utf8'));
