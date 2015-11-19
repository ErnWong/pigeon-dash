module.exports = function(store, buffer, filter) {
  var lastMessage = store[store.length - 1];
  var i = buffer.length - 1;
  while (i >= 0) {
    if (buffer[i] === lastMessage) break;
    i--;
  }
  var newMessages = buffer
    .slice(i + 1)
    .filter(filter);
  store.push.apply(store, newMessages);
};
