// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract NoPregoNFT is ERC1155 {
    uint256 private _nextTokenId = 1;

    // Controle de acesso
    mapping(address => bool) private minters;

    // Metadata
    struct TokenMetadata {
        string name;
        string description;
        string image;
        string properties;
    }

    mapping(uint256 => TokenMetadata) private tokenMetadata;

    // avaliacao dos NFTs.
    // @todo deveria ter lista de avaliadores  
    // @todo emitir sinal de avaliacao?
    mapping(uint256 => uint256) private tokenAvaliacao;

    event Minted(address indexed account, uint256 indexed tokenId);
    event Burned(address indexed account, uint256 indexed tokenId);
    event Transferred(address indexed from, address indexed to, uint256 indexed tokenId);

    constructor() ERC1155("") {
        minters[msg.sender] = true;
    }

    modifier onlyMinter() {
        require(minters[msg.sender], "Not authorized to mint");
        _;
    }

    // Adiciona permissão para mintar um NFT
    /*function addMinter(address account) external onlyOwner {
        minters[account] = true;
    }

    // Remove permissão para mintar um NFT
    function removeMinter(address account) external onlyOwner {
        minters[account] = false;
    }*/

    // Mint do NFT
    function mint(
        address to,
        string memory name,
        string memory description,
        string memory image,
        string memory properties
    ) external onlyMinter returns (uint256) {
        
        uint256 newTokenId = _nextTokenId;
        _nextTokenId++;

        _mint(to, newTokenId, 1, "");

        tokenMetadata[newTokenId] = TokenMetadata(name, description, image, properties);
        
        emit Minted(to, newTokenId);
        return newTokenId;
    }

    // Queima do NFT
    function burn(
        address account,
        uint256 tokenId
    ) external {
        require(
            msg.sender == account || isApprovedForAll(account, msg.sender),
            "Not authorized to burn"
        );

        _burn(account, tokenId, 1);
        emit Burned(account, tokenId);
    }

    // Transferência da NFT de uma carteira para outra
    function transfer(
        address from,
        address to,
        uint256 tokenId
    ) external {
        require(
            // from 0xC08857A0D0811Fc5BeDdD42931c3E5e5a6711523
            // msg.sender 0xbe4ffda2b229f6f0e99a01cf189e4d40fc623b23
            // to 0x47B6f9384F0AFe88692Fb5E32BC9aE14d11395dF
            msg.sender == from || minters[msg.sender] || isApprovedForAll(from, msg.sender),
            "Not authorized to transfer"
        );

        safeTransferFrom(from, to, tokenId, 1, "");
        emit Transferred(from, to, tokenId);
    }

    // Retorno dos metadados do NFT
    function uri(uint256 tokenId) public view override returns (string memory) {
        TokenMetadata memory metadata = tokenMetadata[tokenId];
        return string(abi.encodePacked(
            'data:application/json;utf8,{"name":"',
            metadata.name,
            '", "description":"',
            metadata.description,
            '", "image":"',
            metadata.image,
            '", "properties":"',
            metadata.properties,
           '"}'
        ));
    }

    function avaliar(uint256 _tokenId, uint256 _valor) public {
        // @todo testar lista de avaliadores 
        tokenAvaliacao[_tokenId] = _valor;
    }

    function getAvaliacao(uint256 tokenId) public view returns (uint256 v) {
        // @todo como tratar avaliacao de NFT inexistente? deveria emitir um erro. 
        return tokenAvaliacao[tokenId];
    }    
}
