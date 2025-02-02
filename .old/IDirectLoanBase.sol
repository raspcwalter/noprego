// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import {ILoanData} from "./ILoanData.sol";

interface IDirectLoanBase {
    function maximumLoanDuration() external view returns (uint256);

    function adminFeeInBasisPoints() external view returns (uint16);

    // solhint-disable-next-line func-name-mixedcase
    function LOAN_COORDINATOR() external view returns (bytes32);

    function loanIdToLoan(uint32)
        external
        view
        returns (
            uint256,
            uint256,
            uint256,
            address,
            uint32,
            uint256,
            uint16,
            uint16,
            address,
            uint64,
            address,
            address
        );
   
    function loanRepaidOrLiquidated(uint32) external view returns (bool);

    function getWhetherNonceHasBeenUsedForUser(address _user, uint256 _nonce) external view returns (bool);

    // trabalhamos com vencimento pradonizado 
    function getLoanMaturity() external view returns (uint256);

}