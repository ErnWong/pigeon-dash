module.exports = {
  SELECT_PORT: Symbol('select-port'),
  RECEIVE_PORT_LIST: Symbol('receive-port-list'),
  RECEIVE_PORT_OPEN: Symbol('receive-port-open'),
  RECEIVE_PORT_CLOSE: Symbol('receive-port-close'),
  RECEIVE_PORT_DATA: Symbol('receive-port-data'),
  START_PORT_LISTENING: Symbol('start-port-listening'),
  STOP_PORT_LISTENING: Symbol('stop-port-listening'),
  OPEN_PANEL: Symbol('open-panel'),
  CLOSE_PANEL: Symbol('close-panel'),
  TOGGLE_TERMINAL_PLAYPAUSE: Symbol('toggle-terminal-playpause'),
  START_PLOTTER_RECORDING: Symbol('start-plotter-recording'),
  PAUSE_PLOTTER_RECORDING: Symbol('pause-plotter-recording'),
  CLEAR_PLOTTER: Symbol('clear-plotter'),
  SET_PLOTTER_CHANNEL: Symbol('set-plotter-channel')
};
