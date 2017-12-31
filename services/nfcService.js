"use strict";

const { NFC } = require("nfc-pcsc");

class nfcService {
  constructor() {
    this.nfc = new NFC();
  }

  launchNfcService() {
    return new Promise((resolve, reject) => {
      this.nfc.on("reader", reader => {
        console.log(`${reader.reader.name} device attached`);

        /* Card is object containing following data
          [always] String type: TAG_ISO_14443_3 (standard nfc tags like Mifare) or TAG_ISO_14443_4 (Android HCE and others)
          [always] String standard: same as type
          [only TAG_ISO_14443_3] String uid: tag uid
          [only TAG_ISO_14443_4] Buffer data: raw data from select APDU response */

        reader.on("card", async card => {
          console.log(`\n Card detected`, card);

          try {
            const data = await reader.read(4, 40); // Starts reading in block 4, continues to 5 and 6 in order to read 40 bytes
            const payload = `0x${data.toString()}`; // utf8 is default encoding
            //  console.log(`Data:`, payload);
            resolve(payload);
          } catch (error) {
            console.error(`error when reading data`, error);
          }

          /* Write 40 bytes ethereum address in utf8 @IMPROVE change the encoding because an ethereum address is 20 bytes *
          try {
            const data = Buffer.allocUnsafe(40);
            data.fill(0);
            const text = "0x501C9d92325c6240BEc5cBE18117d3b91eCc65F4";
            data.write(text);
            await reader.write(4, data);
            console.log(`Data written`, data);
          } catch (error) {
            console.error(`error when writing data`, error);
          }*/
        });

        reader.on("card.off", card => {
          //console.log(`${reader.reader.name} card removed`, card);
        });

        reader.on("error", error => {
          console.log(`${reader.reader.name} an error occurred`, error);
        });

        reader.on("end", () => {
          console.log(`${reader.reader.name} device removed`);
        });
      });

      this.nfc.on("error", error => {
        console.log("an error occurred", error);
      });
    });
  }
}

module.exports = nfcService;
