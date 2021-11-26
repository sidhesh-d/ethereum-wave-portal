// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint seed;
    mapping (address => uint256) addressToNumWaves;
    mapping (address => uint256) lastWaveAt;

    event NewWave(address indexed from, string message, uint256 timestamp);
    struct Waves {
        address waver;
        string message;
        uint256 timestamp;
    }

    Waves[] waves;

    constructor() payable {
        console.log("This is wave portal smart contract");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory message) public {
        require(
          lastWaveAt[msg.sender] + 30 seconds < block.timestamp,
          "Chill out for a bit. Wait 15 mins."
        );
        totalWaves += 1;
        addressToNumWaves[msg.sender] += 1;
        waves.push(Waves(msg.sender, message, block.timestamp));
        lastWaveAt[msg.sender] = block.timestamp;
        console.log("%s has waved!", msg.sender);

        seed = (block.timestamp + block.difficulty + seed) % 100;
        console.log("seed is %d", seed);

        //50% chance of winning
        if(seed < 50) {
            console.log("%s has won", msg.sender);
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, message, block.timestamp);
    }

    function getAllWaves() public view returns (Waves[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves", totalWaves);
        return totalWaves;
    }

    function getTotalWavesFromAddr() public view returns (uint256) {
        console.log("Total waves from %s: %s", msg.sender, addressToNumWaves[msg.sender]);
        return addressToNumWaves[msg.sender];
    }
}
