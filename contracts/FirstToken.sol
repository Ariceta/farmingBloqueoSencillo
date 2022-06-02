// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";

contract FirstToken is Ownable, ERC20, ERC20Burnable, ERC20Capped, ERC20Pausable {

    constructor(uint256 initialSupply) ERC20("Token", "TOK") ERC20Capped(10000*1e18) {
        require(initialSupply < 10000*1e18, "Initial supply cannot be bigger than cap");
        ERC20._mint(msg.sender, initialSupply);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _mint(address account, uint256 amount)internal override(ERC20, ERC20Capped) onlyOwner {
        super._mint(account, amount);
    } 

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override (ERC20, ERC20Pausable) {
        super._beforeTokenTransfer(from, to, amount);
    }
   
}
