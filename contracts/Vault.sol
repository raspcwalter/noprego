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

import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";

//import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
//import {IERC1155Receiver} from "@openzeppelin/contracts/interfaces/IERC1155Receiver.sol";

// BokkyPooBah
import {BokkyPooBahsDateTimeLibrary} from "./lib/BokkyPooBahsDateTimeLibrary.sol";

contract Vault is Ownable, Pausable, ReentrancyGuard, NFTReceiver {

    IERC20 constant USDC = IERC20(0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8);

    // storage
    // prazo de maturidade do cofre (timestamp) 
    uint256 public maturidade; 

    DateTime public prazoMaturidade;

    // descrição do cofre
    string public descricao;

    // tokens aceitos
    // lista de tokens ERC-20, inicialmente 1 token
    IERC20 public tokenAceito = USDC; 

    // TVL 
    uint256 public valorTotalDepositado = 0; 

    // total de valores emprestados (tomados)
    uint256 public valorTotalEmprestado = 0;

    // taxa de remuneracao (pontos percentuais)
    uint16 public taxaRemuneracao;

    // taxa de juros (pontos percentuais)
    uint16 public taxaJuros;

    // percentual maximo do que pode ser emprestado
    uint16 public maxEmprestimo;  

    // tem que lidar com mais de um deposito e mais de um emprestimo por investidor / tomador 
    mapping (address => Deposito) public depositos;
    mapping (address => Emprestimo) public emprestimos;

    NoPregoNFT public nft = NoPregoNFT(0x1f255113bc2E7ad29b050eb36CBc008063B2e3f1);

    // @todo array de NFTs (token ids)? como lidar com +1 tipo de NFT / usuario(a)?
    mapping (address => uint256[]) public colaterais;
    mapping (address => uint256) public garantias;

    struct DateTime {
        uint ano; 
        uint mes; 
        uint dia;
        uint hora;
        uint minuto;
        uint segundo;
    }

    // @todo unificar deposito / emprestimo em transacao 
    struct Deposito {
        IERC20 tokenDeposito;
        uint256 valorDeposito;
        DateTime dataDeposito;
    }

    struct Emprestimo {
        IERC20 tokenEmprestimo;
        uint256 valorEmprestimo;
        DateTime dataEmprestimo;
    }

    uint16 public constant HUNDRED_PERCENT = 10000;

constructor() Ownable(msg.sender) {
    setTokenAceito(USDC);
    maxEmprestimo = 8000;
}

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

    function getNFTAceito() public view returns (NoPregoNFT n) {
        return nft;
    }

    function setNFTAceito(NoPregoNFT _nft) public onlyOwner {
        nft = _nft;
    }

    function setTaxas(uint16 _r, uint16 _j) public onlyOwner {
        taxaRemuneracao = _r;
        taxaJuros = _j;
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

    function _incValorTotalEmprestado(IERC20 _t, uint256 _v) private returns (bool status) {
        require(_t == tokenAceito, "token invalido");
        
        // @todo deveria levar reservas em conta 
        require(valorTotalEmprestado + _v <= valorTotalDepositado, "valor depositado no cofre insuficiente");
        
        valorTotalEmprestado += _v;
        return true;
    }

    /* function aprovaDeposito(uint256 _valor) public returns (bool status){
        require(tokenAceito.approve(address(this), _valor), "deposito nao aprovado");
        return true;
    } */

   function getLimiteEmprestimo(address _tomador) public view returns (uint256 l) {
    return maxEmprestimo / HUNDRED_PERCENT * garantias[_tomador];
   }

    function tomaEmprestimo(IERC20 _token, uint256 _valor, 
                uint256 _deadline, uint8 _v, bytes32 _r, bytes32 _s) public returns (bool b) {

        address _tomador = msg.sender;
        Emprestimo memory _emprestimo;
        _emprestimo.tokenEmprestimo = _token;
        _emprestimo.valorEmprestimo = _valor;

        require(!isVencido(), "prazo de vencimento do cofre vencido");
        require(_emprestimo.tokenEmprestimo == getTokenAceito(), "token invalido");
        require(_emprestimo.valorEmprestimo > 0, "quantidade emprestada inferior a zero");

        // @todo limitar a parte das garantias
        uint256 _limiteEmprestimo = getLimiteEmprestimo(_tomador);
        require(_limiteEmprestimo >= _emprestimo.valorEmprestimo, "garantias insuficientes");

        // garante que haja recursos suficientes no cofre 
        require (valorTotalEmprestado + _emprestimo.valorEmprestimo <= valorTotalDepositado, "valor depositado no cofre insuficiente");

        // @todo como conseguir o approval ?
        // Aprovação usando permit
        IERC20Permit(address(_emprestimo.tokenEmprestimo)).permit(
            _tomador,
            address(this),
            _emprestimo.valorEmprestimo,
            _deadline,
            _v,
            _r,
            _s
        );

    uint256 allowance = _emprestimo.tokenEmprestimo.allowance(_tomador, address(this));
    require(allowance >= _emprestimo.valorEmprestimo, "aprovacao de token insuficiente");

        uint256 initialBalance = _emprestimo.tokenEmprestimo.balanceOf(address(this));
        
        // transferir tokens do investidor para o contrato

        SafeERC20.safeTransferFrom(_emprestimo.tokenEmprestimo, address(this), _tomador, _emprestimo.valorEmprestimo); 
        uint256 finalBalance = _emprestimo.tokenEmprestimo.balanceOf(address(this));
        require(finalBalance == initialBalance - _emprestimo.valorEmprestimo, "Saldo final nao corresponde ao esperado");

        (uint y, uint mes, uint d, uint h, uint min, uint s) = BokkyPooBahsDateTimeLibrary.timestampToDateTime(block.timestamp);
        _emprestimo.dataEmprestimo.ano = y;
        _emprestimo.dataEmprestimo.mes = mes;
        _emprestimo.dataEmprestimo.dia = d;
        _emprestimo.dataEmprestimo.hora = h;
        _emprestimo.dataEmprestimo.minuto = min;
        _emprestimo.dataEmprestimo.segundo = s;
         
        // @todo lidar com tomador que jah tinha emprestado do cofre 
        // solucao poderia ser trazer emprestimo inicial a valor presente (com juros) 
        // e adicionar os dois depositos na data do deposito adicional
        // problema: cada emprestimo estah relacionado a um colateral 
        emprestimos[_tomador] = _emprestimo;
        
        require(_incValorTotalEmprestado(_emprestimo.tokenEmprestimo, _emprestimo.valorEmprestimo), "deposito mal sucedido");
        
        return true;
    }

    /*function getDivida(address _tomador) public returns (uint256 d){
        Emprestimo memory _emprestimo = emprestimos[_tomador];

        DateTime memory _d = _emprestimo.dataEmprestimo;

        uint _tinicio = BokkyPooBahsDateTimeLibrary.timestampFromDateTime(_d.ano, _d.mes, _d.dia, _d.hora, _d.minuto, _d.segundo);
        uint _now = block.timestamp; 

        uint _diasEmprestimo = BokkyPooBahsDateTimeLibrary.diffDays(_tinicio, _now);

        // @todo lidar com float 
        uint16 _jurosdia = ((( 1+ (taxaJuros/HUNDRED_PERCENT) ) ^ (1/30) ) -1 )*HUNDRED_PERCENT;
        uint256 _divida = _emprestimo.valorEmprestimo * ((1+_jurosdia/HUNDRED_PERCENT)^_diasEmprestimo);

        return _divida; 

    }*/

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

    function _depositaColateral(NoPregoNFT _nft, uint256 _tokenid) private returns (bool b) {
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
        return _depositaColateral(nft, _tokenid);
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
