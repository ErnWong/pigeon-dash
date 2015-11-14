var PanelTypes = require('../constants/panel-types');
var TerminalManager = require('../utils/terminal-manager');
var PlotterManager = require('../utils/plotter-manager');
var SettingsManager = require('../utils/settings-manager');

var inits = new Map();
inits.set(PanelTypes.TERMINAL, TerminalManager.init);
inits.set(PanelTypes.PLOTTER, PlotterManager.init);
inits.set(PanelTypes.SETTINGS, SettingsManager.init);

var renders = new Map();
renders.set(PanelTypes.TERMINAL, TerminalManager.render);
renders.set(PanelTypes.PLOTTER, PlotterManager.render);
renders.set(PanelTypes.SETTINGS, SettingsManager.render);

module.exports = {
  inits: inits,
  renders: renders
};
