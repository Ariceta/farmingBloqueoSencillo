// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "../interfaces/IToken.sol";

contract MintMultipleTokens is Ownable {

    using SafeERC20 for IToken;

    constructor(){}

    function mintSpecificToken(address _token, address to, uint256 amount) public {
        IToken(_token).mint(to, amount);
    } 
}