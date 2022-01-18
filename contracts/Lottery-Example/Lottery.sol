// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SafeMath.sol";

contract Lottery is Ownable {    
    
    using SafeMath for uint256;

    uint256 public reward;
    uint256 public numPlayers = 0;        
    uint256 public maxPlayers = 10;
        
    mapping (uint256 => address payable) public players;
    mapping (address => bool) public participated;

    enum State { Accepting, Distributing, Paid }        
    State internal state;

    event Log(address me, address gambler, uint amount, string message);
    
    constructor() {                        
        state = State.Accepting;
    }

    receive () external payable { }
    fallback() external payable { }

    function destroyLottery() public onlyOwner {        
        require(reward == 0 && numPlayers == 0, "PLAYERS OR LOTTERY BALANCE EXISTS");
        emit Log(msg.sender, address(this), reward, "LOTTERY DESTROY CALLED");
        if (reward == 0 && numPlayers == 0){
            renounceOwnership();
        }
    }
    
    function setReward(uint256 _reward) public onlyOwner joinable {        
        require(_reward < reward, "INVALID REWARD VALUE");
        reward = _reward;
    }

    function totalParticipants(uint256 _maxPlayers) public onlyOwner isFinished {
        require(_maxPlayers > 0, "INVALID MAX PLAYER VALUE");
        maxPlayers = _maxPlayers;
    }

    function bet() public payable joinable {
        require(msg.value > 0, "INVALID CONTRIBUTION AMOUNT");        
        console.log("bet from %s of %s", msg.sender, msg.value);
        require(participated[msg.sender] == false, "SINGLE ENTRY ALLOWED");
        if(msg.value > 0){
            if(participated[msg.sender] == false){                
                players[numPlayers] = payable(msg.sender);
                participated[msg.sender] = true;
                numPlayers++;
                if (numPlayers == maxPlayers){
                    state = State.Distributing;
                }
            }
            reward += msg.value;
            if (state == State.Distributing){
                collectReward();
            }
        }

    }

    modifier joinable(){
        require (state == State.Accepting, "Accepting");
        _;
    }
    modifier isFinished(){
        require (state == State.Distributing, "Distributing");
        _;
    }
    modifier restartable(){
        require (state == State.Paid, "Paid");
        _;
    }

    function collectReward() private isFinished {        
        emit Log(address(this), msg.sender, msg.value, "selectWinner");
        uint winner = random() % maxPlayers;                        
        payable(players[winner]).transfer(reward);               
        console.log(""); 
        console.log("Lottery (selectWinner): randomIndex:%s", winner);
        console.log("%s won %s", players[winner], reward);
        console.log("");
        state = State.Paid;
        restart();
    }
    
    function restart() private restartable {
        reward = 0;
        numPlayers = 0;
        address payable a;
        for (uint i = 0; i < maxPlayers; i++){
            participated[players[i]] = false;
            players[i] = a;
        }
        state = State.Accepting;
    }

    function rewardUsers() public payable onlyOwner joinable {                        
        require(msg.value > 0, "INVALID TRANSFER AMOUNT");        
        require(numPlayers > 0, "REQUIRES AT LEAST ONE PLAYER");
        for (uint32 i = 0; i < numPlayers; i++) {
            uint256 amountToDistribute = msg.value; 
            uint256 rewardSlice = amountToDistribute.div(numPlayers);
            payable(players[i]).transfer(rewardSlice);               
        }
    }

    function random() private returns (uint){
        uint rnd = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp))); 
        emit Log(address(this), msg.sender, rnd, "random");        
        return rnd;     
    }
}
