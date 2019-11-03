// import { AssertionError } from "assert";

//var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');
var ERC721MintableComplete = artifacts.require('ERC721TokenComplete');

let tokenName = 'realEstatoken';
let tokenSymbol = 'RSTKN';


contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new(tokenName, tokenSymbol,{from: account_one});

            // TODO: mint multiple tokens
            
            console.log('minting start');

            await this.contract.mint(account_one, 0,{from: account_one});
            await this.contract.mint(account_one, 1,{from: account_one});
            await this.contract.mint(account_one, 2,{from: account_one});
        })

        it('should return total supply', async function () { 
            let totalSupply = await this.contract.totalSupply();
            console.log('totalsupply:',totalSupply);
            assert.equal(totalSupply,3, 'retured total supply');
        })

        it('should get token balance', async function () { 
            let tokenBalance = await this.contract.balanceOf(account_one);
            console.log('tokenBalance:', tokenBalance);
            assert.equal(tokenBalance,3, 'returned token balance');

        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenURI = await this.contract.tokenURI(0);
            console.log('token URI:',tokenURI);
            assert.equal(tokenURI, 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/0', 'returned token URI');
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_one, account_two, 0, {from: account_one});
            console.log('this.contract.ownerOf(0):',await this.contract.ownerOf(0), 'account_two:',account_two);
            assert.equal(await this.contract.ownerOf(0), account_two, 'transfer succeeded');
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new(tokenName, tokenSymbol,{from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            try {let result = await this.contract.mint(account_two,3, {from:account_two});}
            catch(e){
                console.log(e.reason);
                assert.equal(e.reason, 'only the owner can execute', 'failed when minting when address is not the contract owner');
            }
           
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.getOwner();
            console.log("owner:",owner);
            assert.equal(owner, account_one, 'contract owner returned');
            
        })

    });
})