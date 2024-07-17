// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

interface IPermittedERC20s {
    function getERC20Permit(address _erc20) external view returns (bool);
}