"use strict";

module.exports = function(ctx) {
  // extract context from passed in object
  const cryptoService = require("./services/cryptoService"),
    bcrypt = require("bcrypt"),
    ObjectId = require("mongodb").ObjectId,
    db = ctx.db,
    server = ctx.server;

  // assign collection to variable for further use
  const collection = db.collection("users");

  /**
   * Login user
   */
  server.post("/users/login", (req, res, next) => {
    collection.findOne({ email: req.body.email }).then(user => {
      if (user !== null) {
        if (req.body.email === user.email) {
          bcrypt
            .compare(req.body.password, user.password)
            .then(result => {
              if (result === true) {
                cryptoService.decrypt(user.keystore).then(keystore => {
                  user.keystore = keystore;
                  delete user.password;
                  const data = Object.assign({}, user);
                  res.send(200, { error: [], result: "Valid password", data });
                });
              } else {
                res.send(200, { error: [], result: "Invalid password" });
              }
            })
            .catch(error => {
              res.send(500, error);
            });

          next();
        }
      } else {
        res.send(200, { error: [], result: "The user doesn't exist" });
      }
    });
  });

  /*
    * Adding an encryption and (hash) of the keystore
    * The password is prompt when the server start
    * HAVE TO adding more secrutiy with ssl, http-signature...
    */
  /**
   * Creating a new user
   */
  server.post("/users/signup", (req, res, next) => {
    // Check if the user ever exist
    collection.findOne({ email: req.body.email }).then(user => {
      if (user === null) {
        // Creating a new user
        const data = Object.assign({}, req.body, {
          created: new Date()
        });

        bcrypt.hash(req.body.password, 12).then(hash => {
          data.password = hash;

          cryptoService.encrypt(req.body.keystore).then(keystore => {
            data.keystore = keystore;

            // insert one object into users collection
            collection
              .insertOne(data)
              .then(doc =>
                res.send(200, {
                  error: [],
                  result: "Success! New user created"
                })
              )
              .catch(error => res.send(500, { error, result: [] }));

            next();
          });
        });
      } else {
        res.send(200, { error: [], result: "The user ever exist" });
      }
    });
  });

  /**
   * Updating existing user
   */
  server.put("/users/:id", (req, res, next) => {
    // extract data from body and add timestamps
    collection.findOne({ email: req.body.email }).then(user => {
      if (user !== null) {
        const data = Object.assign({}, req.body, {
          updated: new Date()
        });
        // build out findOneAndUpdate variables to keep things organized
        let query = { _id: new ObjectId(req.body.id) },
          body = { $set: data },
          opts = {
            returnOriginal: false,
            upsert: true
          };

        // find and update document based on passed in id (via route)
        collection
          .findOneAndUpdate(query, body, opts)
          .then(doc =>
            res.send(204, { error: [], result: "The user has been updated" })
          )
          .catch(error =>
            res.send(500, { error, result: "Failed to update the user" })
          );

        next();
      } else {
        res.send(200, { error: [], result: "The user doesn't exist" });
      }
    });
  });

  /**
   * Deleting user
   */
  server.del("/users/:id", (req, res, next) => {
    // remove one document based on passed in id (via route)
    collection
      .deleteOne({ _id: new ObjectId(req.body.id) })
      .then(doc => res.send(204))
      .catch(error => res.send(500, error));

    next();
  });
};
