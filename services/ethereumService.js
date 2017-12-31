const Web3 = require("web3");

// We have to switch to webSocket because httpProvider is depracted
// 'ws://localhost:8546'

const web3 = new Web3("https://rinkeby.infura.io/5ysRjN9mODHFf7aqQqzp");
//const web3 = new Web3("http://127.0.0.1:7545");

module.exports = web3;
