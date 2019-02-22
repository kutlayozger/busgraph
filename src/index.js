var lib = {};

lib.GraphContainer = require("./GraphContainer");

lib.initialize = function (opt) {
	return Promise.resolve();
};

lib.finalize = function () {
};

lib.newGraphContainer = function () {
	return new lib.GraphContainer();
};

module.exports = lib;