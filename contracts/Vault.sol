// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {NoPregoNFT} from "./NoPregoNFT.sol";
import {NFTReceiver} from "./utils/NFTReceiver.sol";

// Open Zeppelin
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

//import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
//import {IERC1155Receiver} from "@openzeppelin/contracts/interfaces/IERC1155Receiver.sol";

// BokkyPooBah
import {BokkyPooBahsDateTimeLibrary} from "./lib/BokkyPooBahsDateTimeLibrary.sol";

contract Vault is Ownable, Pausable, ReentrancyGuard, NFTReceiver {

    IERC20 constant USDC = IERC20(0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8);

    // storage
    // prazo de maturidade do cofre (timestamp) 
    uint maturidade; 

    DateTime prazoMaturidade;

    // descrição do cofre
    string descricao;

    // tokens aceitos
    // lista de tokens ERC-20, inicialmente 1 token
    IERC20 tokenAceito = USDC; 

    // TVL 
    uint256 valorTotalDepositado = 0; 

    // total de valores emprestados (tomados)
    uint256 valorTotalEmprestado = 0;

    // taxa de remuneracao (pontos percentuais)
    uint16 taxaRemuneracao;

    // taxa de juros (pontos percentuais)
    uint16 taxaJuros;

    mapping (address => Deposito) depositos;

    NoPregoNFT private nft = NoPregoNFT(0xdE498DA263F00DC362Ba20BE9621d967E719AEd7);

    // @todo array de NFTs (token ids)? como lidar com +1 tipo de NFT / usuario(a)?
    mapping (address => uint256[]) colaterais;
    mapping (address => uint256) garantias;

    struct DateTime {
        uint ano; 
        uint mes; 
        uint dia;
        uint hora;
        uint minuto;
        uint segundo;
    }

    struct Deposito {
        IERC20 tokenDeposito;
        uint256 valorDeposito;
        DateTime dataDeposito;
    }

constructor() Ownable(msg.sender) {
    // maturidade = block.timestamp;
    setTokenAceito(USDC);

}

/*constructor(
        address _admin,
        uint256 _maturidade,
        string memory _descricao,
        IERC20 _tokenAceito,
        uint16 _taxaRemuneracao,
        uint16 _taxaJuros
    ) Ownable(_admin) {
        maturidade = _maturidade;
        descricao = _descricao;
        tokenAceito = _tokenAceito;
        taxaRemuneracao = _taxaRemuneracao;
        taxaJuros = _taxaJuros;
    }*/ 

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

    function getLoanERC20Denomination() public view returns (IERC20) {
        return tokenAceito;
    }

    function getTokenAceito() public view returns (IERC20 t) {
        return tokenAceito;
    }

    function setTokenAceito(IERC20 _a) public onlyOwner {
        // require admin 
        tokenAceito = _a;
    }

    function getValorTotalDepositado() public view returns (uint256 v) {
        return valorTotalDepositado;
    }

    function _incValorTotalDepositado(IERC20 _t, uint256 _v) private returns (bool status) {
        require(_t == tokenAceito, "token invalido");
        // deveria avaliar se limite do cofre está atendido 
        valorTotalDepositado += _v;
        return true;
    }

    /* function aprovaDeposito(uint256 _valor) public returns (bool status){
        require(tokenAceito.approve(address(this), _valor), "deposito nao aprovado");
        return true;
    } */

    function depositaNoCofre(IERC20 _token, uint256 _valor) public returns (bool status) {
        address _investidor = msg.sender;
        Deposito memory _deposito; 
        _deposito.tokenDeposito = _token;
        _deposito.valorDeposito = _valor;

        require(_deposito.tokenDeposito == tokenAceito, "token invalido");
        require(_deposito.valorDeposito > 0, "quantidade depositada inferior a zero");

        // aprova deposito (nao funciona)
        //SafeERC20.safeIncreaseAllowance(_deposito.tokenDeposito, address(this), _deposito.valorDeposito);
        // require(_deposito.tokenDeposito.approve(address(this), _deposito.valorDeposito), "quantidade nao aprovada");
        // require(aprovaDeposito(_deposito.valorDeposito), "deposito nao aprovado");       

        uint256 initialBalance = _deposito.tokenDeposito.balanceOf(address(this));
        // transferir tokens do investidor para o contrato 
        // require(_deposito.tokenDeposito.transferFrom(_investidor, address(this), _deposito.valorDeposito), "Transferencia falhou");
        SafeERC20.safeTransferFrom(_deposito.tokenDeposito, _investidor, address(this), _deposito.valorDeposito); 
        uint256 finalBalance = _deposito.tokenDeposito.balanceOf(address(this));
        require(finalBalance == initialBalance + _deposito.valorDeposito, "Saldo final nao corresponde ao esperado");

        (uint y, uint mes, uint d, uint h, uint min, uint s) = BokkyPooBahsDateTimeLibrary.timestampToDateTime(block.timestamp);
        _deposito.dataDeposito.ano = y;
        _deposito.dataDeposito.mes = mes;
        _deposito.dataDeposito.dia = d;
        _deposito.dataDeposito.hora = h;
        _deposito.dataDeposito.minuto = min;
        _deposito.dataDeposito.segundo = s;

        // @todo lidar com investidor que jah tinha depositado no cofre 
        // solucao poderia ser trazer deposito inicial a valor presente (com juros) 
        // e adicionar os dois depositos na data do deposito adicional 
        depositos[_investidor] = _deposito;
        
        require(_incValorTotalDepositado(_deposito.tokenDeposito, _deposito.valorDeposito), "deposito mal sucedido");
        return true;
    }

    function depositaColateral(NoPregoNFT _nft, uint256 _tokenid) public returns (bool b) {
        address _tomador = msg.sender;

        // @todo verificar KYC
        // deveria ter lista de usuario(a)s na NoPrego 

        colaterais[_tomador].push(_tokenid);

        // verifica valor da avaliacao
        garantias[_tomador] += _nft.getAvaliacao(_tokenid); 

        // @todo deveria transferir o NFT para o cofre
        _nft.transfer(_tomador, address(this), _tokenid); 

        return true;

    }

    function depositaColateral(uint256 _tokenid) public returns (bool b) {
        return depositaColateral(nft, _tokenid);
    }


    function setDataVencimento(uint _ano, uint _mes, uint _dia) public onlyOwner {
        require(BokkyPooBahsDateTimeLibrary.isValidDate(_ano, _mes, _dia), "data invalida!");
        prazoMaturidade.ano = _ano;
        prazoMaturidade.mes = _mes;
        prazoMaturidade.dia = _dia;
        prazoMaturidade.hora = 0;
        prazoMaturidade.minuto = 0;
        prazoMaturidade.segundo = 0;
    }

    function setDataHoraVencimento(uint _ano, uint _mes, uint _dia, uint _hora, uint _minuto, uint _segundo) public onlyOwner {
        require(BokkyPooBahsDateTimeLibrary.isValidDateTime(_ano, _mes, _dia, _hora, _minuto, _segundo), "data/hora invalidas!");
        prazoMaturidade.ano = _ano;
        prazoMaturidade.mes = _mes;
        prazoMaturidade.dia = _dia;
        prazoMaturidade.hora = _hora;
        prazoMaturidade.minuto = _minuto;
        prazoMaturidade.segundo = _segundo;
    }

    function getPrazoVencimnento() public view returns (DateTime memory p) {
        return prazoMaturidade; 
    }

    function isVencido() public view returns (bool b) {
        uint agora = block.timestamp;
        uint vencimentoTimestamp = BokkyPooBahsDateTimeLibrary.timestampFromDateTime(prazoMaturidade.ano, 
        prazoMaturidade.mes, prazoMaturidade.dia, prazoMaturidade.hora, prazoMaturidade.minuto, prazoMaturidade.segundo);
        return (agora < vencimentoTimestamp ? false : true);
    }

    function getDescricao() public view returns (string memory d) {
        return descricao;
    }

    function setDescricao(string memory _d) public onlyOwner {
        descricao = _d; 
    }

    function getColaterais(address _tomador) public view returns (uint256[] memory nfts) {
        return colaterais[_tomador];
    }

    function getGarantias(address _tomador) public view returns (uint256 g) {
        return garantias[_tomador];
    }

}
