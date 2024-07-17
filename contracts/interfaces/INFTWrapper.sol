// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

/**
 * @title INftTypeRegistry
 * @author NFTfi
 * @dev Interface for NFT Wrappers.
 */

interface INFTWrapper {
    function transferNFT(
        address from,
        address to,
        address nftContract,
        uint256 tokenId
    ) external returns (bool);

    function isOwner(
        address owner,
        address nftContract,
        uint256 tokenId
    ) external view returns (bool);
}