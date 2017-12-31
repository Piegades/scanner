const fs = require("fs"),
  pw = require("pw"),
  crypto = require("./cryptoService"),
  walleter = require("./walletService"),
  web3 = require("./ethereumService");

module.exports = function launch(passwor) {
  return new Promise((resolve, reject) => {
    fs.open("keystore", "r", (error, fd) => {
      if (error) {
        if (error.code === "ENOENT") {
          console.error("keystore does not exist");
          process.stdout.write(
            "We will create a new account \n Enter a new password: "
          );
          pw(password => {
            process.stdout.write("Please repeat the password: ");
            pw(repeatedPassword => {
              if (password === repeatedPassword) {
                walleter.newWallet().then(account => {
                  const encryptedAccount = web3.eth.accounts.encrypt(
                    account.privateKey,
                    password
                  );
                  fs.open("keystore", "wx", (error, fd) => {
                    if (error) {
                      if (error.code === "EEXIST") {
                        console.error("keystore already exists");
                        return;
                      }
                    }
                    fs.writeFile(
                      "keystore",
                      JSON.stringify(encryptedAccount),
                      error => {
                        if (error) throw err;
                        console.log("The file has been saved!");
                      }
                    );
                  });
                });
                return resolve(account);
              } else {
                process.stdout.write("The process is aborted. Retry");
                return process.exit();
              }
            });
          });
        }
      }
      fs.readFile("keystore", (error, encryptedAccount) => {
        if (error) {
          console.error(error);
        }
        /*  process.stdout.write("🔑 Enter Your Password: ");
        pw(password => {*/
        const decryptedAccount = web3.eth.accounts.decrypt(
          JSON.parse(encryptedAccount),
          "password"
        );
        const wallet = web3.eth.accounts.wallet.add(decryptedAccount);
        const account = web3.eth.accounts.wallet.length;
        if (account === 1) {
          return resolve(wallet);
        } else if (account === 0) {
          process.stdout.write("No account in the keystore");
          return process.exit();
        } else {
          console.error(
            "An error has occured this device has more than one account"
          );
          return process.exit();
        }
        //  });
      });
    });
  });
};
