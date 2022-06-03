// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";

contract SecondToken is AccessControl, ERC20, ERC20Burnable, ERC20Capped, ERC20Pausable {

    event Mensaje(string mensaje);

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    constructor(uint256 initialSupply) ERC20("Token2", "TOK2") ERC20Capped(10000*1e18) {
        require(initialSupply < 10000*1e18, "Initial supply cannot be bigger than cap");
        ERC20._mint(msg.sender, initialSupply);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        emit Mensaje("Estoy minteando el token 2");
        _mint(to, amount);
    }

    function _mint(address account, uint256 amount)internal override(ERC20, ERC20Capped) {
        super._mint(account, amount);
    } 

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override (ERC20, ERC20Pausable) {
        super._beforeTokenTransfer(from, to, amount);
    }
   
}
