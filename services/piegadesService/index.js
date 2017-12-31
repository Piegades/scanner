/*
 * it's will become a package;
 */

const ethJsUtil = require("ethereumjs-util");
const web3 = require("../ethereumService");
/*const databaseAbi = require("./PiegadesContracts/build/contracts/Database.json")
  .abi;
const databaseAddress = "0x7103d207F60059bDf7a72F023F9fEF4026b0ba01";

const productAbi = require("./PiegadesContracts/build/contracts/Product.json")
  .abi;
//const proudctAdress = "0x36f3c0b8b129800ca22ff9d5bd01c80bf8c3b3f09135ca24e87ea617e5eaec07"

const productFactoryAbi = require("./PiegadesContracts/build/contracts/ProductFactory.json")
  .abi;
const productFactoryAddress = "0xf10ed0ee9ee3ee3d72240ecf29f76fcc8364e314";
*/

const databaseAbi = require("./databaseAbi");
const productFactoryAbi = require("./productFactoryAbi");
const productAbi = require("./productAbi");

const databaseAddress = "0x6c3a5565ea57521ce4e152e071abd1d2477c5852";
const productFactoryAddress = "0x82868bc537be1940c19a46fad13db373d266c0c5";

const productFactoryContract = new web3.eth.Contract(
  productFactoryAbi,
  productFactoryAddress
);

const piegadesService = {
  addAction(productAddress, name, geoUri, privateKey) {
    return new Promise((resolve, reject) => {
      const productContract = new web3.eth.Contract(productAbi, productAddress);

      const data = productContract.methods
        .addAction(web3.utils.asciiToHex(name), web3.utils.asciiToHex(geoUri))
        .encodeABI();

      productContract.methods
        .addAction(web3.utils.asciiToHex(name), web3.utils.asciiToHex(geoUri))
        .estimateGas((error, gasAmount) => {
          if (error) {
            console.log(error);
          }
          const gas = gasAmount * 10;
          const tx = {
            gas,
            to: productAddress,
            data
          };

          web3.eth.accounts.signTransaction(tx, privateKey, (error, hash) => {
            web3.eth.sendSignedTransaction(
              hash.rawTransaction,
              (error, transaction) => {
                if (error) {
                  console.log(error);
                }
                console.log(transaction);
              }
            );
            /*  web3.eth
              .sendSignedTransaction(hash.rawTransaction)
              .on("transactionHash", hash => {
                console.log(hash);
              })
              .on("receipt", receipt => {
                console.log(receipt);
              })
              .on("confirmation", (confirmationNumber, receipt) => {
                console.log(confirmationNumber, receipt);
              })
              .on("error", console.error);
          });
          /*web3.eth.accounts.signTransaction(tx, privateKey, (error, hash) => {
            web3.eth.sendSignedTransaction(
              hash.rawTransaction,
              (error, transaction) => {
                if (error) {
                  console.log(error);
                }
                console.log(transaction);
              }
            );
          });*/
          });
        });
    });
  },

  createProduct(name, additionalInformation, geoUri, privateKey) {
    return new Promise((resolve, reject) => {
      const data = productFactoryContract.methods
        .createProduct(
          web3.utils.asciiToHex(name),
          web3.utils.asciiToHex(additionalInformation),
          web3.utils.asciiToHex(geoUri),
          databaseAddress
        )
        .encodeABI();

      productFactoryContract.methods
        .createProduct(
          web3.utils.asciiToHex(name),
          web3.utils.asciiToHex(additionalInformation),
          web3.utils.asciiToHex(geoUri),
          databaseAddress
        )
        .estimateGas((error, gasAmount) => {
          if (error) {
            console.error(error);
          }
          const gas = gasAmount * 2;

          const tx = {
            gas,
            to: productFactoryAddress,
            data
          };

          web3.eth.accounts.signTransaction(tx, privateKey, (error, hash) => {
            web3.eth
              .sendSignedTransaction(hash.rawTransaction)
              .on("receipt", receipt => {
                const logEvent = {
                  productContractAddress: `0x${receipt.logs[0].data.slice(
                    26,
                    66
                  )}`,
                  ownerAddress: `0x${receipt.logs[0].data.slice(90, 130)}`,
                  timestamp: web3.utils.hexToNumber(
                    receipt.logs[0].data.slice(130)
                  )
                };
                return resolve(logEvent);
              })
              .on("error", error => {
                reject(new Error("Failed to create a new product", error));
              });
          });
        });
    });
  }
};

module.exports = piegadesService;
