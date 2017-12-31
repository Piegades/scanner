# Heimdall

> Heimdall is a node server for managing user account and their Ethereum
> keystore. In Scandinavian mythology, Heimdall was the guardian of Bifröst, the
> rainbow bridge leading to Asgard.

You should never be using a central server for managing private keys especially
when your working on decentralized technologies such as Ethereum or blockchain.
But sometimes for a pilot, a POC or in dev env, you need to go quickly, in this
case Heimdall can be a great tool. For managing Ethereum private keys see:
[uPort](https://uport.me/)

## Security info

The password of the user will be hashed thanks to bcrypt and stored in mongodb.
But the keystore will be encrypted with a password prompt when the server start.
Be CAREFUL this usage is not a substitute for the server/db security. Password
are freely available in the RAM, a determined Hacker can get whatever she wants.

USERS TRUST YOU RESPECT THAT

## Prerequisites

* Node 8.x not tested on Node 9.x
* MongoDB
* Command Line Tools

## Getting Started

### Setting up the dev environment

```bash
# Get the latest snapshot
#https
git clone https://gitlab.com/ahmb84/Heimdall.git
#ssh
git clone git@gitlab.com:ahmb84/Heimdall.git

# Change directory
cd Heimdall/

# Install NPM dependencies
npm install
or
yarn

# Run the server
node index.js
When prompt for a password, enter a 256 bytes password (32 characters)
The server will listen on the localhost port 4000. You can change it in the config.js file

# Getting around with the API.

Heimdall have two endpoints: Login and SignUp

# Signup
@email, @password @keystore should return a success message. If the user ever exist it will throw an error.
Input: curl -d '{ email: "email@email.co", password: "password", keystore: {...} }' -H "Content-Type: application/json" -X POST http://localhost:4000/users/signup
Output: { error: [], result: "Success! New user created" }

# Login
@email, @password should return the keystore, the email, and the _id of the user. If the user don't exist it will throw an error.
Input: curl -d '{ email: "email@email.co", password: "password"}' -H "Content-Type: application/json" -X POST http://localhost:4000/users/login
Output: { error: [], result: "Valid password", data }
```

## License

Heimdall is licensed under the GNU Affero General Public License v3.0
