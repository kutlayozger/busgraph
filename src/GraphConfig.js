(function () {
    var config = {};

    config.server = 'localhost';
    config.backgroundMode = "black";

    config.baseLineColor = '#f88';
    config.stopColor = '#88f';
    config.hintBackgroundColor = "#FFFFE1";
    config.busColor = "#f00";
    config.busAlarmColor = "#0f0";
	config.lineStartY = 50;
	config.stopRadius = 4;
	config.thickness = 10;
    config.busLineWidth = 50;

    module.exports = config;
}());