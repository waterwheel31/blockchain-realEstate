
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

const fs = require('fs');
var proof = fs.readFileSync("proof.json").toString();
var JsonProof = JSON.parse(proof);

let tokenName = 'realEstatoken';
let tokenSymbol = 'RSTKN';


contract('TestSolnSquareVerifier', accounts =>{

    const account_one = accounts[0];
    
    let a = JsonProof.proof.a;
    let b = JsonProof.proof.b;
    let c = JsonProof.proof.c;
    let inputs = JsonProof.inputs;
    console.log('a:',a); 
    console.log('b:',b);
    console.log('c:',c);
    console.log('inputs:',inputs);

    describe('testing of the integrated contract', function(){

        beforeEach(async function(){
            this.contract = await SolnSquareVerifier.new(tokenName, tokenSymbol,{from: account_one});
        });

        console.log('test start');

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('test if a new solution can be added for contract', async function(){
      
            await this.contract.addSolution(a,b,c,inputs, {from: account_one});

            let arrLen = await this.contract.getArrLength.call();
            console.log("arrLen:",arrLen);

            assert.equal(arrLen, 1,  'new solution is not created');
        });

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('test if an ERC721 token can be minted for contract', async function(){
            
            var supplyBefore = await this.contract.totalSupply.call();
            console.log('supply Before:',supplyBefore);

            await this.contract.mint(account_one, 1);
            
            var supplyAfter = await this.contract.totalSupply.call();
            console.log('supply After:',supplyAfter);

            assert.equal(supplyAfter.toNumber(), supplyBefore + 1,  'new token is not minted');
        });

    });

});
