const Dieet = artifacts.require("Dieet.sol");

module.exports = function (deployer) {
  deployer.deploy(Dieet);
};
