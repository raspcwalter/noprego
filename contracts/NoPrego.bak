// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Vault} from "./Vault.sol";

// Open Zeppelin
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title NoPrego
 * @notice NoPrego dapp.  
 * RWA de obras de arte que são colaterais (garantias) para empréstimo on chain com taxa pré fixada.
 * 
 */

contract NoPrego is Ownable, Pausable, ReentrancyGuard {

    // STORAGE
    // mapping(bytes32 => address) private contracts;

    // usuario(a)s
    // qual eh a melhor estrutura?
    
    // cofres 
    Vault[] public cofres; 

    // EVENTS
    
    // CONSTRUCTOR
    /**
     * @dev construtor do contrato principal (que detem os cofres)
     *
     */
    constructor() Ownable(msg.sender) {
        _criaCofres();
    }

    function _criaCofres() private {
        Vault a = new Vault();
        a.setDataVencimento(2024,10,5);
        a.setDescricao("5OUT24 1%");
        a.setTaxas(100, 200);
        cofres.push(a);

        Vault b = new Vault();
        b.setDataVencimento(2024,12,5);
        b.setDescricao("5DEZ24 2%");
        b.setTaxas(200, 300);
        cofres.push(b);

        Vault c = new Vault();
        c.setDataVencimento(2025,2,5);
        c.setDescricao("5FEV25 3%");
        c.setTaxas(300, 400);
        cofres.push(c);

        Vault d = new Vault();
        d.setDataVencimento(2025,4,5);
        d.setDescricao("5ABR25 4%");
        d.setTaxas(400, 500);
        cofres.push(d);

    }

}