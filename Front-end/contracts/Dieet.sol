// SPDX-License-Identifier: MIT
pragma solidity >=0.8.5;

contract Dieet {
  address owner;
  mapping(address => User) users;
  mapping(address => uint[]) gewichten;
  struct User { 
    uint doel;
    uint beloning;
  }
  constructor(){
    owner = msg.sender;
  }
  //laat nieuwe gebruiker toevoegen
  function newUser(uint _doel, uint _beloning) public {
    users[msg.sender] = User(_doel, _beloning*1e18);
  }
  // deze functie laat de user een gewicht updaten
  function userNewGewicht(uint _gewicht) public {
    if (users[msg.sender].doel != 0) {
      if (_gewicht <= users[msg.sender].doel){
        payable(msg.sender).transfer(users[msg.sender].beloning);
        delete users[msg.sender];
        delete gewichten[msg.sender];
      } else {
        gewichten[msg.sender].push(_gewicht);
      }
    }
  }
  //laat waarde van beloning bepalen
  function setBeloning() public payable {}
  
  // geeft overzicht van alle gewichten
  function returnArray(address _user) public view returns (uint[] memory) {
    return gewichten[_user];
  }
   //laat beloning zien van de user
  function getBeloning(address _user) public view returns (uint) {
    return users[_user].beloning;
  }
  //laat het doel gewicht zien van de user
  function getDoel(address _user) public view returns (uint) {
    return users[_user].doel;
  }
 
}