// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Open Zeppelin
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Vault is Ownable, Pausable, ReentrancyGuard {

    // storage
    // prazo de maturidade do cofre 
    uint256 maturidade;

    // descrição do cofre
    string descricao;

    // tokens aceitos
    // lista de tokens ERC-20, inicialmente 1 token
    address tokensAceitos; 

    // TVL 
    uint256 valorTotalDepositado = 0; 

    // total de valores emprestados (tomados)
    uint256 valorTotalEmprestado = 0;

    // taxa de remuneracao (pontos percentuais)
    uint16 taxaRemuneracao;

    // taxa de juros (pontos percentuais)
    uint16 taxaJuros;

constructor(
        address _admin,
        uint256 _maturidade,
        string memory _descricao,
        address _tokenAceito,
        uint16 _taxaRemuneracao,
        uint16 _taxaJuros
    ) Ownable(_admin) {
        maturidade = _maturidade;
        descricao = _descricao;
        tokensAceitos = _tokenAceito;
        taxaRemuneracao = _taxaRemuneracao;
        taxaJuros = _taxaJuros;
    }

}
