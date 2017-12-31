const Ipfs = require("./ipfsService");
const bs58 = require("bs58");
const registryArtifact = require("uport-registry");
const web3 = require("./ethereumService");

const base58ToHex = b58 => {
  const hexBuf = new Buffer(bs58.decode(b58));
  return hexBuf.toString("hex");
};

const hexToBase58 = hexStr => {
  const buf = new Buffer(hexStr, "hex");
  return bs58.encode(buf);
};

const UportRegistryContract = new web3.eth.Contract(
  registryArtifact.abi,
  "0x2cc31912b2b0f3075a87b3640923d45a26cef3ee"
);

const ipfs = new Ipfs();

const dataService = {
  get(key, address) {
    return new Promise((resolve, reject) => {
      UportRegistryContract.methods
        .get(web3.utils.asciiToHex(key), address, address)
        .call({ from: address }, (error, ipfsHashHex) => {
          if (error) {
            console.log(error);
            reject(new Error("An error is occured when calling the contract"));
          }
          if (
            ipfsHashHex === "0x" ||
            ipfsHashHex ===
              "0x0000000000000000000000000000000000000000000000000000000000000000"
          ) {
            resolve([]);
          }
          const ipfsHash = hexToBase58(`1220${ipfsHashHex.slice(2)}`);
          ipfs
            .fetch(ipfsHash)
            .then(data => {
              resolve(data);
            })
            .catch(reject(new Error("Failed to get object from IPFS")));
        });
    });
  },

  set(key, address, data, privateKey) {
    return new Promise((resolve, reject) => {
      ipfs.store(data).then(ipfsHash => {
        const ipfsHashHex = base58ToHex(ipfsHash);
        const regSafeIpfs = `0x${ipfsHashHex.slice(4)}`;
        const data = UportRegistryContract.methods
          .set(web3.utils.asciiToHex(key), address, regSafeIpfs)
          .encodeABI();

        UportRegistryContract.methods
          .set(web3.utils.asciiToHex(key), address, regSafeIpfs)
          .estimateGas((error, gasAmount) => {
            if (error) {
              console.log(error);
            }

            const tx = {
              gas: gasAmount,
              to: "0x2cc31912b2b0f3075a87b3640923d45a26cef3ee",
              data
            };

            web3.eth.accounts.signTransaction(tx, privateKey, (error, hash) => {
              web3.eth
                .sendSignedTransaction(hash.rawTransaction)
                .on("transactionHash", hash => {
                  console.log(hash);
                })
                /*  .on("receipt", receipt => {
                  console.log(receipt);
                })
                .on("confirmation", (confirmationNumber, receipt) => {
                  console.log(confirmationNumber, receipt);
                })*/
                .on("error", console.error); // If a out of gas error, the second parameter is the receipt.
              /* web3.eth.sendSignedTransaction(hash.rawTransaction, (error, transaction) => {
                if (error) {
                  console.log(error);
                }
                console.log(transaction);
              });*
            });*/
            });
          });
      });
    });
  }
};

module.exports = dataService;
