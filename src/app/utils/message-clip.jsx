module.exports = function(buffer, size) {
  if (buffer.length > size) {
    buffer.splice(0, buffer.length - size);
  }
}
