'use strict';

module.exports = KeyChain;
////////////////////////////////////////////////////////////////////////////////
var Bitcoin = require('bitcoinjs-lib');
var assert  = require('assert');
var Helpers = require('./helpers');
var eth  = require('ethereumjs-util');

////////////////////////////////////////////////////////////////////////////////
// keychain
function KeyChain(extendedKey, index, cache) {
  this._chainRoot = null;
  this.init(extendedKey, index, cache);


  // this function should be part of the instance because it is memoized
  this._getKey = Helpers.memoize(function(index) {
    assert(typeof(index) === "number" && index >= 0, "Key index must be integer >= 0");
    assert(this._chainRoot, "KeyChain is not initialized.")
    return this._chainRoot.derive(index);
  });
};

Object.defineProperties(KeyChain.prototype, {
  "xpub": {
    configurable: false,
    get: function() { return this._chainRoot ? this._chainRoot.neutered().toBase58() : null;}
  }
});

KeyChain.prototype.init = function(extendedKey, index, cache) {
  // don't override the chain once initialized
  this._origindex = index;
  if (this._chainRoot) return this;
  // if cache is defined we use it to recreate the chain
  // otherwise we generate it using extendedKey and index
  if (cache) {
    this._extkey = cache;
    this._chainRoot = Bitcoin.HDNode.fromBase58(cache);
  }
  else {
    this._extkey = extendedKey;
    this._chainRoot = extendedKey && Helpers.isNumber(index) && index >= 0
      ? Bitcoin.HDNode.fromBase58(extendedKey).derive(index) : undefined;
  };
  return this;
};



KeyChain.prototype.getAddress = function(index) {
  assert(typeof(index) === "number" && index >= 0, "Address index must be integer >= 0");

  return eth.publicToAddress(this._getKey(index).pubKey.toBufferUncompressed().slice(-64)).toString('hex');
};

KeyChain.prototype.getPrivateKey = function(index) {
  assert(typeof(index) === "number" && index >= 0 , "private key index must be integer >= 0");
  var key = this._getKey(index).privKey;
  return key ? key : null;
};
