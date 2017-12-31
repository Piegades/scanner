"use strict";

const express = require("express"),
  { NFC } = require("nfc-pcsc"),
  launch = require("./services/launchService"),
  piegades = require("./services/piegadesService"),
  web3 = require("./services/ethereumService");

const app = express();
const GEO_URI =
  "geo:25.2531745,55.3656728"; /* For example this the localisation of the Dubai Airport */

/*
{ productContractAddress: '0xf74ad80b8a1790b51906440fa7966f8053cd59c9',
  ownerAddress: '0x4d36398115cac52320a7109b7e1eecac702c01d1',
  timestamp: 1514157397 }
*/

launch("password").then(result => {
  const nfc = new NFC();

  nfc.on("reader", reader => {
    console.log(`${reader.reader.name} device attached`);

    /* Card is object containing following data
    [always] String type: TAG_ISO_14443_3 (standard nfc tags like Mifare) or TAG_ISO_14443_4 (Android HCE and others)
    [always] String standard: same as type
    [only TAG_ISO_14443_3] String uid: tag uid
    [only TAG_ISO_14443_4] Buffer data: raw data from select APDU response */

    reader.on("card", async card => {
      console.log(`\n Card detected`, card);

      /* Write 40 bytes ethereum address in utf8 @IMPROVE change the encoding because an ethereum address is 20 bytes *
      try {
        const data = Buffer.allocUnsafe(40);
        data.fill(0);
        const text = "f74ad80b8a1790b51906440fa7966f8053cd59c9";
        data.write(text);
        await reader.write(4, data);
        console.log(`Data written`, data);
      } catch (error) {
        console.error(`error when writing data`, error);
      }
*/
      try {
        const data = await reader.read(4, 40); // Starts reading in block 4, continues to 5 and 6 in order to read 40 bytes
        const productAddress = `0x${data.toString()}`; // utf8 is default encoding
        console.log(productAddress);

        piegades
          .addAction(productAddress, "scan", GEO_URI, result.privateKey)
          .then(scan => {
            console.log(scan);
          });
      } catch (error) {
        console.error(`error when reading data`, error);
      }
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

  nfc.on("error", error => {
    console.log("an error occurred", error);
  });
  /*
  app.get("/", function(req, res) {
    res.send("Hello. This is a piegades scanner");
  });

  app.listen(8000);
  console.log("App successfully launched!");*/
});
