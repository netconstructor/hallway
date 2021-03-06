var url = require("url");
var crypto = require("crypto");
var mmh = require("murmurhash3");

// make sure it's parsed and clean up url-ish bits of the data we don't want
exports.parse = function(idrStr) {
  if (typeof idrStr == "object") return idrStr;
  var idr = url.parse(idrStr);
  if (idr.hash && idr.hash[0] == "#") idr.hash = idr.hash.substring(1);
  if (idr.protocol && idr.protocol.substr(-1) == ":") idr.protocol = idr.protocol.substring(0,idr.protocol.length-1);
  if (idr.path && idr.path[0] == "/") idr.path = idr.path.substring(1);
  if (idr.pathname && idr.pathname[0] == "/") idr.pathname = idr.pathname.substring(1);
  return idr;
}

exports.toString = function(idr) {
  idr = exports.parse(idr);
  if (idr.path && idr.path[0] != "/") idr.path = "/" + idr.path;
  if (idr.pathname && idr.pathname[0] != "/") idr.pathname = "/" + idr.pathname;
  return url.format(idr);
}

/// Returns just the base of the given idr
exports.base = function(idr) {
  idr = exports.parse(idr);
  var baseIdr = {
    protocol:idr.protocol,
    auth:idr.auth,
    host:idr.host,
    pathname:idr.pathname
  };
  if (baseIdr.pathname && baseIdr.pathname[0] == "/") baseIdr.pathname = baseIdr.pathname.substring(1);

  return baseIdr;
}

/// Returns the global of the given idr
exports.global = function(idr) {
  idr = exports.parse(idr);
  var gIdr = {
    hash:idr.hash,
    protocol:idr.protocol,
    host:idr.host
  };
  return gIdr;
}

exports.clone = function(idr) {
  // XXX man this feels so nasty!
  return exports.parse(exports.toString(idr));
}

exports.hash = function(idr) {
  return mmh.murmur128HexSync(exports.toString(exports.parse(idr)));
}

exports.baseHash = function(idr) {
  return mmh.murmur128HexSync(exports.toString(exports.base(exports.parse(idr))));
}
