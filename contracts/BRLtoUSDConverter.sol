// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/sepolia
 **/

contract BRLtoUSDConverter is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;
  
    string public rate;
    bytes32 private jobId;
    uint256 private fee;

    event RequestLowPriceFulfilled(bytes32 indexed requestId, string rate);
    
    constructor() ConfirmedOwner(msg.sender) {

        /*https://docs.chain.link/any-api/testnet-oracles*/
                
        _setChainlinkToken(0x779877A7B0D9E8603169DdbD7836e478b4624789); // Endereço LINK sepolia
        _setChainlinkOracle(0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD); // Endereço do oráculo
        
       jobId = "7d80a6386ef543a3abb52817f6707e3b"; // Job ID que retorna string Chainlink
               
        fee = (1 * LINK_DIVISIBILITY) / 10;  // 0,1 *10 **18 (Variável de acordo com a rede e o job)
    }
    
    //Envia a solicitação para o óraculo chainlink e retorna o ID da solicitação
    function requestBRLtoUSDRate() public returns (bytes32 requestId) {
        
        Chainlink.Request memory request = _buildChainlinkRequest(
            jobId, 
            address(this), 
            this.fulfill.selector
        );

        request._add("get", "https://economia.awesomeapi.com.br/last/BRL-USD");
        request._add("path", "BRLUSD,bid");
        //request._add("path", "BRLUSD.bid");
        
        return _sendChainlinkRequest(request, fee);
    }
    
    //Processa a resposta do óraculo
    function fulfill(bytes32 _requestId, string memory _rate) public recordChainlinkFulfillment(_requestId) {
       rate = _rate;
       emit RequestLowPriceFulfilled(_requestId, _rate);
    }
 
    //Retorna a taxa de câmbio BRL/USD
    function getRate() public view returns (string memory) {
         return rate;
    }
}
