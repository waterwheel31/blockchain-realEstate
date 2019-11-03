pragma solidity >=0.4.21 <0.6.0;

import './ERC721Mintable.sol';
import './verifier.sol';

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class

contract SolnSquareVerifier is ERC721TokenComplete, Verifier {

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        bytes32 hashIndex;
        address senderAddress;
        bool isMinted;
    }

// TODO define an array of the above struct
    Solution[] solutionsArr;

// TODO define a mapping to store unique solutions submitted
    mapping (address => Solution) solutions;

// TODO Create an event to emit when a solution is added
    event SolutionAdded(bytes32 index, address senderAddress);

// TODO Create a function to add the solutions to the array and emit the event
    function addSolution(uint[2] memory a, uint[2][2] memory b,
                         uint[2] memory c, uint[2] memory inputs)
                public
    {
        bool isValid = verifyTx(a,b,c,inputs);
        require(isValid, 'The solution is not valid');

        bytes32 solutionHash = keccak256(abi.encodePacked(a,b,c,inputs));

        Solution memory solution = Solution({
            hashIndex : solutionHash,
            senderAddress : msg.sender,
            isMinted : false
        });

        solutions[msg.sender] = solution;
        solutionsArr.push(solution);
        emit SolutionAdded (solutionHash, msg.sender);
    }

// TODO Create a function to mint new NFT only after the solution has been verified

    function mint(address to, uint tokenId)
        public
        returns(bool)
    {
        //  - make sure the solution is unique (has not been used before)
        Solution memory solution = solutions[to];
        require(!solution.isMinted, 'this solution is used before');

        _mint(to, tokenId);
        solutions[to].isMinted = true;

        //  - make surehandle metadata as well as tokenSuplly
        _setTokenURI(tokenId);
        return true;
    }

    constructor(string memory name, string memory symbol)
    ERC721TokenComplete(name, symbol) public {}

    function getArrLength() external returns(uint8){
       
        uint8 len = uint8(solutionsArr.length);
        return len;
    }

}


























