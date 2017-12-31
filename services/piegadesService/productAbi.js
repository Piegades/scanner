const productAbi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "bytes32"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "consume",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "dataBaseContract",
    outputs: [
      {
        name: "",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "isDelivered",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "description",
        type: "bytes32"
      },
      {
        name: "geoUri",
        type: "bytes32"
      }
    ],
    name: "addAction",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    name: "actions",
    outputs: [
      {
        name: "handler",
        type: "address"
      },
      {
        name: "description",
        type: "bytes32"
      },
      {
        name: "geoUri",
        type: "bytes32"
      },
      {
        name: "timestamp",
        type: "uint256"
      },
      {
        name: "blockNumber",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "additionalInformation",
    outputs: [
      {
        name: "",
        type: "bytes32"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "productFactoryContract",
    outputs: [
      {
        name: "",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        name: "_name",
        type: "bytes32"
      },
      {
        name: "_additionalInformation",
        type: "bytes32"
      },
      {
        name: "_geoUri",
        type: "bytes32"
      },
      {
        name: "_dataBaseContract",
        type: "address"
      },
      {
        name: "_productFactoryContract",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    payable: false,
    stateMutability: "nonpayable",
    type: "fallback"
  }
];

module.exports = productAbi;
