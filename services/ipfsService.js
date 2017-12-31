"use strict";

const IPFS = require("ipfs");

// Have to use package string_decoder. It's a node core package. // https://www.npmjs.com/package/string_decoder
// So maybe launch the server with node as https://github.com/ipfs/js-ipfs/tree/master/examples/browser-webpack.

class ipfsService {
  constructor() {
    this.node = new IPFS({ repo: String(Math.random() + Date.now()) });
  }

  store(data) {
    return new Promise((resolve, reject) => {
      if (this.node.isOnline() === true) {
        this.node.files.add(Buffer.from(data), (error, response) => {
          if (error || !response) {
            return reject(new Error(`ipfs add error, ${error}`));
          }

          response.forEach(file => {
            if (file && file.hash) {
              return resolve(file.hash);
            }
          });
        });
      } else {
        this.node.on("ready", () => {
          this.node.files.add(Buffer.from(data), (error, response) => {
            if (error || !response) {
              return reject(new Error(`ipfs add error, ${error}`));
            }

            response.forEach(file => {
              if (file && file.hash) {
                return resolve(file.hash);
              }
            });
          });
        });
      }
    });
  }

  fetch(hash) {
    return new Promise((resolve, reject) => {
      if (this.node.isOnline() == true) {
        this.node.files.cat(hash, (error, response) => {
          if (error) {
            return reject(new Error(`ipfs cat error, ${error}`));
          }

          return resolve(response.toString());
        });
      }
      this.node.on("ready", () => {
        this.node.files.cat(hash, (error, response) => {
          if (error) {
            return reject(new Error(`ipfs cat error, ${error}`));
          }

          return resolve(response.toString());
        });
      });
    });
  }
}

module.exports = ipfsService;
