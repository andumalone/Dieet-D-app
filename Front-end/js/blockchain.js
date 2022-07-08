// Created by: Andwele Jong Loy

$(document).ready(function () {
  // fill here your smart contract address
  const contractAddress = '0xa74E2Cc385d9668E1A3aBaA0f15c3fe892D1C9C3';

  //main function
  async function app() {

    //metamask connectie

    const ethEnabled = await (async ()=>{
          await window.ethereum.request({method: 'eth_requestAccounts'});
    })


    //open pipeline to the blockchain
    this.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545/'));

    // Give error is no provider
    if (this.web3 == null) {
      $("#ErrorMessage").html("Er is geen connectie met de blockchain, maak connectie met ganache")
      $("#ErrorMessage").show();
      return;
    }

    //Connect to the contract
    this.contract = await new this.web3.eth.Contract(metadata, contractAddress);

    // error messages
    if (this.contract == null) {
      $("#ErrorMessage").html("Er is geen smart contract")
      $("#ErrorMessage").show();
      return;
    }

    // User has no Ethereum accounts
   const accounts = await this.web3.eth.getAccounts
    if (accounts.length == 0) {
      $("#ErrorMessage").html("Maak een Ethereum wallet aan.")
      $("#ErrorMessage").show();
      return;
    }

    // get account from storage
    if (window.localStorage.getItem('userAddress') == null) {
      window.location = "/";
    } else {
      this.account = window.localStorage.getItem('userAddress')
      document.getElementById('userAddress').innerText = `ETH Address: ${this.account}`;
    }

    // on start run this
    getCurrentBalance();

    // if the send money button is clicked
    $("#btnCreateUser").click(function () {
      createUser();
      depositEth();
    });



    // if the addweight button is clicked
    $("#btnAddGewicht").click(function () {
      adder();
    });

    // if the logout button is clicked
    $("#btnLogOut").click(function () {
      logout();
    });

    // if the show userdata button is clicked
    $("#btnUserData").click(function () {
      showInfo();
    });
    }

  //---------- the functions ---------------

  //Get current balance from contract
  async function getCurrentBalance() {
    // call the smartcontract function
    const balance = await this.contract.methods.getBeloning(this.account).call();
    // covnvert wei into ethers
    const ether = this.web3.utils.fromWei(balance, "ether");

    //update the html view
    $('#amountEth').html(`Dit contract heeft: ${ether} als beloning .`)

    // show elements according to the balance
    /*if (balance > 0 ) {
      document.getElementById("adduser").style.display = "none";
      document.getElementById("gewichtAdder").style.display = "inline";
    } else {
      document.getElementById("adduser").style.display = "inline";
      document.getElementById("gewichtAdder").style.display = "none";
    }*/
  }
  // show information as alert
  async function showInfo() {
    const doel = await this.contract.methods.getUserDoel(this.account).call();
    const weigtharray = await this.contract.methods.returnArray(this.account).call();
    if (doel == 0) {
      alert(`Je moet eerst een doel hebben`)
    } else {
      let arr = []
      let entry = 0
      for (const element of weigtharray) {
        entry += 1
        arr.push(`Entry ${entry}: ${element}`)
      }
      alert(`Dit is zijn jouw gegevens:
    Doel: ${doel} KG
    Gewicht data: ${arr}`)
    }
  }
  // logout user and go to start page
  function logout() {
    window.localStorage.removeItem("userAddress");
    window.location = '/'
  }

  //Put Ethers on your contract
  async function depositEth() {

    //get ethers amount from application
    let etherAmount = $("stuurEth").val();;

    // quit if empty field
    if (!etherAmount) {
      return;
    }

    //convert it to wei
    let weiValue = await this.web3.utils.toWei(etherAmount, "ether");

    //call blockchain and deposit
    let sendit = await this.contract.methods.setBeloning().send({
      from: this.account,
      value: weiValue
    });

    //reset input box
    $("#stuurEth").val('');

    //update balance
    getCurrentBalance();
  }
  // adds user to smart contract
  async function createUser() {

    //get ethers amount from application
    let valDoel = $("#setDoel").val();;
    let valBeloning = $("#stuurEth").val();;

    // quit if empty field
    if (!valDoel | !valBeloning) {
      alert("Please fill in both");
      return;
    }
    if (valDoel <= 30) {
      alert("Doel is te laag, dit gewicht is ongezond");
      return;
    }
    if (valBeloning < 1) {
      alert("Beloning mag niet lager dan 1 ETH");
      return;
    }

    //call blockchain and deposit
    const sendit = await this.contract.methods.addUser(valDoel, valBeloning).send({
      from: this.account
    });

    //reset input box
    $("#setDoel").val('');

    getCurrentBalance();
  }
  // add weight value of user to smart contract
  async function adder() {

    //read the value from the html form
    let gewichtsWaarde = $("#addGewicht").val();

    //check if empty
    if (!gewichtsWaarde) {
      return;
    }
    if (gewichtsWaarde <= 30) {
      alert("voeg een geschikte waarde toe");
      return;
    }

    const sendit = await this.contract.methods.userNewGewicht(gewichtsWaarde).send({
      from: this.account
    });
    //clear html field
    $("#userNewGewicht").val('');

    const balance = await this.contract.methods.getBeloning(this.account).call();
    if (balance == 0) {
      alert("Lekker bezig je hebt je doel behaald.")
    }
    getCurrentBalance();
  }

  // run maim function at startup
  app();
});