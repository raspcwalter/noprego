// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract NoPregoNFT is ERC1155, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Controle de acesso
    mapping(address => bool) private minters;

    // Metadata
    struct TokenMetadata {
        string name;
        string description;
        string image;
        string properties;
        uint256 price;
    }

    mapping(uint256 => TokenMetadata) private tokenMetadata;

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
    function addMinter(address account) external onlyOwner {
        minters[account] = true;
    }

    // Remove permissão para mintar um NFT
    function removeMinter(address account) external onlyOwner {
        minters[account] = false;
    }

    // Mint do NFT
    function mint(
        address to,
        string memory name,
        string memory description,
        string memory image,
        string memory properties,
        uint256 price
    ) external onlyMinter returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(to, newTokenId, 1, "");

        tokenMetadata[newTokenId] = TokenMetadata(name, description, image, properties, price);
        
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
            msg.sender == from || minters[msg.sender],
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
            '", "price":"',
            Strings.toString(metadata.price),
            '"}'
        ));
    }    
}
