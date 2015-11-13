function parse(input) {
  input = input.trim();
  var timestamp = '';
  var channel = '';
  var message = '';

  var sigStart = input.indexOf('[');
  var sigMid = -1;
  var sigEnd = -1;

  if (sigStart < 0) return createInfo(timestamp, channel, message, input);

  sigMid = input.indexOf('|', sigStart);
  sigEnd = input.indexOf(']', sigStart);

  if (sigEnd < 0) return createInfo(timestamp, channel, message, input);
  if (sigMid > sigEnd) sigMid = sigStart;

  timestamp = input.substring(sigStart + 1, sigMid).trim();
  channel = input.substring(sigMid + 1, sigEnd).trim();
  message = input.substring(sigEnd + 1).trim();

  return createInfo(timestamp, channel, message, input);
}

function createInfo(timestamp, channel, message, raw) {
  return {
    timestamp: +timestamp,
    channel: channel,
    message: message,
    raw: raw
  };
}

module.exports = parse;
