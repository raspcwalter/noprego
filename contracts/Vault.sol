// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Open Zeppelin
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// BokkyPooBah
import {BokkyPooBahsDateTimeLibrary} from "./BokkyPooBahsDateTimeLibrary/BokkyPooBahsDateTimeLibrary.sol";

contract Vault is Ownable, Pausable, ReentrancyGuard {

    // storage
    // prazo de maturidade do cofre (timestamp) 
    uint maturidade; 

    Prazo prazoMaturidade;

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

    struct Prazo {
        uint ano; 
        uint mes; 
        uint dia;
        uint hora;
        uint minuto;
        uint segundo;
    }

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

   /* struct Offer {
        uint256 loanPrincipalAmount;
        uint256 maximumRepaymentAmount;
        uint256 nftCollateralId;
        address nftCollateralContract;
        uint32 loanDuration;
        uint16 loanAdminFeeInBasisPoints;
        address loanERC20Denomination;
        address referrer;
    }*/

    function getLoanERC20Denomination() public view returns (address) {
        return tokensAceitos;
    }

    function setDataVencimento(uint _ano, uint _mes, uint _dia) public {
        require(BokkyPooBahsDateTimeLibrary.isValidDate(_ano, _mes, _dia), "data invalida!");
        prazoMaturidade.ano = _ano;
        prazoMaturidade.mes = _mes;
        prazoMaturidade.dia = _dia;
        prazoMaturidade.hora = 0;
        prazoMaturidade.minuto = 0;
        prazoMaturidade.segundo = 0;
    }

    function setDataHoraVencimento(uint _ano, uint _mes, uint _dia, uint _hora, uint _minuto, uint _segundo) {
        require(BokkyPooBahsDateTimeLibrary.isValidDateTime(_ano, _mes, _dia, _hora, _minuto, _segundo), "data/hora invalidas!");
        prazoMaturidade.ano = _ano;
        prazoMaturidade.mes = _mes;
        prazoMaturidade.dia = _dia;
        prazoMaturidade.hora = _hora;
        prazoMaturidade.minuto = _minuto;
        prazoMaturidade.segundo = _segundo;
    }

    function getPrazoVencimnento() public view returns (Prazo memory p) {
        return prazoMaturidade; 
    }

    function isVencido() public view returns (boolean) {
        uint agora = now;
        uint vencimentoTimestamp = BokkyPooBahsDateTimeLibrary.timestampFromDateTime(prazoMaturidade.ano, 
        prazoMaturidade.mes, prazoMaturidade.dia, prazoMaturidade.hora, prazoMaturidade.minuto, prazoMaturidade.segundo);
        return (agora < vencimentoTimeStamp ? false : true);
    }

}
