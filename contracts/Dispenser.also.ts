// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title WAM Token with built-in AVAX dispenser (Avalanche C-Chain)
/// @notice 1 AVAX = 100,000 WAM (so 0.1 AVAX = 10,000 WAM)
contract WamWithDispenser is ERC20, Ownable {
    // 1 AVAX = 100,000 WAM
    uint256 public constant RATE = 100_000;

    event TokensPurchased(address indexed buyer, uint256 avaxAmount, uint256 tokenAmount);
    event AvaxWithdrawn(address indexed to, uint256 amount);

    constructor(uint256 initialSupply)
        ERC20("WAM Token", "WAM")
        Ownable(msg.sender)
    {
        _mint(address(this), initialSupply * 10 ** decimals());
    }

    /// @notice Buy WAM by sending AVAX
    function buyTokens() public payable {
        require(msg.value > 0, "Send AVAX to buy tokens");

        // Fix: include token decimals in calculation
        uint256 tokensToSend = (msg.value * RATE * 10 ** decimals()) / 1 ether;

        require(balanceOf(address(this)) >= tokensToSend, "Not enough WAM left in dispenser");

        _transfer(address(this), msg.sender, tokensToSend);

        emit TokensPurchased(msg.sender, msg.value, tokensToSend);
    }

    /// @notice Allow direct AVAX transfers to trigger buy
    receive() external payable {
        buyTokens();
    }

    /// @notice Withdraw AVAX
    function withdrawAVAX(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        (bool ok, ) = owner().call{value: amount}("");
        require(ok, "AVAX transfer failed");
        emit AvaxWithdrawn(owner(), amount);
    }

    /// @notice Withdraw all AVAX
    function withdrawAllAVAX() external onlyOwner {
        uint256 amount = address(this).balance;
        (bool ok, ) = owner().call{value: amount}("");
        require(ok, "AVAX transfer failed");
        emit AvaxWithdrawn(owner(), amount);
    }
}
