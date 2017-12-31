const productFactoryAbi = [
  {
    constant: false,
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
      }
    ],
    name: "createProduct",
    outputs: [
      {
        name: "",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getProductCount",
    outputs: [
      {
        name: "productCount",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
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
    name: "products",
    outputs: [
      {
        name: "product",
        type: "address"
      },
      {
        name: "owner",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    payable: false,
    stateMutability: "nonpayable",
    type: "fallback"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "productAddress",
        type: "address"
      },
      {
        indexed: false,
        name: "ownerAddress",
        type: "address"
      },
      {
        indexed: false,
        name: "createdAt",
        type: "uint256"
      }
    ],
    name: "NewProductCreated",
    type: "event"
  }
];

module.exports = productFactoryAbi;
