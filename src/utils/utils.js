exports.lastOf = function(string, char) {
	return string.length - string.split(char)[string.split(char).length - 1].length - 1;
};
