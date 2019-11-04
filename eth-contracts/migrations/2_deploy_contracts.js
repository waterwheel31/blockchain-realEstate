// migrating the appropriate contracts
var Verifier = artifacts.require("./verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

let tokenName = 'realEstatoken';
let tokenSymbol = 'RSTKN';


module.exports = function(deployer) {
  deployer.deploy(Verifier).then(function(){
    return  deployer.deploy(SolnSquareVerifier, tokenName, tokenSymbol);
  });
};
