const InfecDiseaInfo = artifacts.require("./infecDisInfo.sol");

module.exports = function(deployer) {
  deployer.deploy(InfecDiseaInfo);
};