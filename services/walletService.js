const mnid = require("mnid");
const web3 = require("./ethereumService");

const walletService = {
  newWallet() {
    return new Promise((resolve, reject) => {
      const wallet = web3.eth.accounts.wallet.create();
      const account = web3.eth.accounts.create();
      web3.eth.accounts.wallet.add(account);
      account.mnid = mnid.encode({
        network: "0x4",
        address: account.address
      });
      resolve(account);
    });
  },

  recoverWallet() {}
};

module.exports = walletService;

/*
const walletService = {

  setSeed(password, seedPhrase) {
    return new Promise((resolve, reject) => {
      if (password.length < 8) {
        reject(new Error("Invalid password. It' should be have more than 8 charachters"));
      }
      keystore
        .createVault(
        {
          password,
          seedPhrase,
            // random salt
          hdPathString: "m/0'/0'/0'",
        },
          (error, ks) => {
            setWeb3Provider(ks);
          }
        )
        .catch(reject(new Error('An error has been occured when creating the vault')));
    });
  },

  newWallet(password) {
    return new Promise((resolve, reject) => {
      if (password.length < 8) {
        reject(new Error("Invalid password. It' should be have more than 8 charachters"));
      }
      const array = new Uint32Array(32);
      const extraEntropy = window.crypto.getRandomValues(array);
      const randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy.toString());
      const infoString = `Your new wallet seed is: "${randomSeed}". Please write it down on paper or in a password manager, you will need it to access your wallet. Do not let anyone see this seed or they can take your Ether. Please enter a password to encrypt your seed while in the browser.`;
      lightwallet.keystore.createVault(
        {
          password,
          seedPhrase: randomSeed,
          // random salt
          hdPathString: "m/0'/0'/0'",
        },
        (error, ks) => {
          ks.keyFromPassword(password, (error, pwDerivedKey) => {
            ks.generateNewAddress(pwDerivedKey);
            const userEthereumAccount = ks;
            userEthereumAccount.seedPhrase = randomSeed;
            userEthereumAccount.password = password;
            userEthereumAccount.mnid = mnid.encode({
              network: '0x4',
              address: `0x${ks.addresses[0]}`,
            });
            // prompt(userEthereumAccount);
            console.log(ks);
            walletService.setWeb3Provider(password, ks, ks.addresses);
            // resolve(userEthereumAccount);
          });
        }
      );
    });
  },
};

export { walletService, web3 };
*/
