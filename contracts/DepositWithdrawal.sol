// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract DepositWithdrawal is Ownable {

    using SafeERC20 for IERC20;

    mapping (address => bool) public whiteList;
    IERC20 public token;

    constructor(address _token){
        token = IERC20(_token);
    }

    modifier inWhiteList(){
        require(whiteList[msg.sender] = true, "You are not whitelisted");
        _;
    }

    function addToWhiteList(address user) public onlyOwner{
        whiteList[user] = true;
    }

    function removeFromWhiteList(address user) public onlyOwner{
        whiteList[user] = false;
    }

    function deposit(uint256 amount) public inWhiteList{
        token.safeTransferFrom(msg.sender, address(this), amount);
    }

    function withdraw(uint256 amount) public inWhiteList{
        token.safeTransfer(msg.sender, amount);
    }
}