pragma solidity 0.4.18;

import "./Database.sol";
/* @title Product Contract
   @author David Riudor
   @dev This contract represents a product to be tracked in the Piegādes platform.
   This product lets the handlers to register actions on it */

/*
  This smart contract could be improved in several ways:
   - add timeouts for state reversal (e.g. object is released by one party but not accepted by next)
   = add escrow payments also for carriers, otherwise they can block forever
   - add delivery dates for carriers, if not met their escrow balance will be punished
   - add insurance interface for, e.g. transport delay or damage insurance */

contract Product {

    /* @dev Reference to its database contract. */
    address public dataBaseContract;
    /* @dev Reference to its product factory. */
    address public productFactoryContract;

  /* @notice Constructor to create a Product
     @param _name The name of the Product
     @param _additionalInformation Additional information about the Product,
            generally as a JSON object.
     @param _parentProducts Addresses of the parent products of the Product.
     @param _lon Longitude x10^10 where the Product is created.
     @param _lat Latitude x10^10 where the Product is created.
     @param _dataBaseContract Reference to its database contract
     @param _productFactoryContract Reference to its product factory */
    function Product(
        bytes32 _name,
        bytes32 _additionalInformation,
        int _geoUri,
        address _dataBaseContract,
        address _productFactoryContract) public {
        name = _name;
        isDelivered = false;
        additionalInformation = _additionalInformation;

        dataBaseContract = _dataBaseContract;
        productFactoryContract = _productFactoryContract;

        Action memory creation;
        creation.handler = msg.sender;
        creation.description = "Product creation";
        creation.geoUri = _geoUri;
        creation.timestamp = now;
        creation.blockNumber = block.number;

        actions.push(creation);

        Database database = Database(dataBaseContract);
        database.storeProductReference(this);
    }

    /* @dev This struct represents an action realized by a handler on the product. */
    struct Action {
        // @dev address of the individual or the organization who realizes the action.
        address handler;
        // @dev description of the action.
        bytes32 description;
        // @dev GeoUri where the Action is done.
        // https://en.wikipedia.org/wiki/Geo_URI_scheme
        // https://tools.wmflabs.org/geohack/geohack.php?language=en&pagename=United_Arab_Emirates
        // &params=25_15_N_55_18_E__globe:export&title=United%20Arab%20Emirates
        int geoUri;
        // @dev Instant of time when the Action is done.
        uint timestamp;
        // @dev Block when the Action is done.
        uint blockNumber;
    }

    // @dev if the Product is Delivered the transaction can't be done.
    modifier notDelivered {
        if (isDelivered)
            revert();
        _;
    }

    /* @dev struct for now the deprature, the steps, and the final destination of the product */
    struct FromStepsTo {
        // @dev the deprature place of the product
        bytes32 from;
        // @dev steps/stops places of the product
        string[] steps;
        // @dev the final destination of the product
        bytes32 to;
    }

    // @dev indicates if a product has been Delivered or not.
    bool public isDelivered;

    // @dev indicates the name of a product.
    bytes32 public name;

    // @dev Additional information about the Product, generally as a JSON object
    bytes32 public additionalInformation;

    // @dev all the actions which have been applied to the Product.
    Action[] public actions;

    function () public {
      // If anyone wants to send Ether to this contract, the transaction gets rejected
        revert();
    }

    /* Check attestation signature → address who made the attestation
    Let us to check if the attester have the correct authorisation for making the actions
    function verifyIdentityAttester(
        bytes32 msgHash,
        uint8 v, bytes32 r, bytes32 s,
        address attesterAddress) public returns (bool) {
        // https://github.com/ethereum/go-ethereum/issues/3731
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = keccak256(prefix, msgHash);
        address addr = ecrecover(prefixedHash, v, r, s);

      //return addr;
        if (addr == attesterAddress) {
            return true;
        } else {
            return false;
        }
    }

    /* @notice Function to add an Action to the product.
       @param _description The description of the Action.
       @param  geoUri where the Action is done.
       @param _Delivered True if the product becomes Delivered after the action. */
    function addAction(
        //bytes32 type,
        bytes32 description,
        int geoUri) public notDelivered {
        //bool _delivered) public notDelivered {

        Action memory action;
        action.handler = msg.sender;
        action.description = description;
        action.geoUri = geoUri;
        action.timestamp = now;
        action.blockNumber = block.number;

        actions.push(action);

    }

      /* @notice Function to consume the Product */
    function consume() public notDelivered {
        isDelivered = true;
    }
}

/* @title Product Factory Contract
   @dev This contract represents a product factory which represents products to be tracked in
   the Piegādes platform. This product lets the handlers to register actions on it. */

contract ProductFactory {

    /* Index of created Product */
    /* Index of created Product */
    struct ProductOwner {
        address product;
        address owner;
    }

    /* Array of product owner; */
    ProductOwner[] public products;


    event NewProductCreated(address productAddress, address ownerAddress, uint createdAt);


    /* If anyone wants to send Ether to this contract, the transaction gets rejected*/
    function () public {
        revert();
    }

    function getProductCount() public constant returns(uint productCount) {
        return products.length;
    }

    /* @notice Function to create a Product
       @param _name The name of the Product
       @param _additionalInformation Additional information about the Product,
              generally as the IPFS has of a JSON object.
       @param _geoUri GeoUri where the Product is created.
       @param _dataBaseContract Reference to its database contract */
    function createProduct(
        bytes32 _name,
        bytes32 _additionalInformation,
        int _geoUri,
        address dataBaseContract
        ) public returns(address) {
        //return new Product(_name, _additionalInformation, _geoUri, dataBaseContract, this);
        Product product = new Product(_name, _additionalInformation, _geoUri, dataBaseContract, this);
        ProductOwner memory newlyCreatedProduct;
        newlyCreatedProduct.product = product;
        newlyCreatedProduct.owner = msg.sender;
        products.push(newlyCreatedProduct);
        NewProductCreated(product, msg.sender, now);
        return product;
    }
}
