import React, { Component, useState, useEffect } from "react";
import "./swap.css";
import logo from "./logo.png";
import logo1 from "./logo1.jpeg";
import {
  contractAddress,
  abi,
  tokenAddres1,
  tokenAbi1,
  tokenAddres2,
  tokenAbi2,
} from "../utils/constant";
import Web3 from "web3";
function Swap() {
  let accountAd;
  const [account, setAccount] = useState("Connect to Wallet");

  const [showLinks, setShowLinks] = useState(false);
  const [dailyProfit, setdailyProfit] = useState(24);
  const [totalReturn, setTotalReturn] = useState(200);
  const [withdrawn, setwithdrawn] = useState(0);
  const [withdrawAble, setwithdrawAble] = useState(0);
  const [enterAmount, setEnterAmount] = useState();
  const [balance, setbalance] = useState(0);
  const [days, setdays] = useState(0);
  const [dailyreward, setdailyreward] = useState(0);
  const [userdeposit, setuserdeposit] = useState(0);

  const getData = async () => {
    try {
      const web3 = window.web3;
      let contract = new web3.eth.Contract(tokenAbi1, tokenAddres1);
      let users = await contract.methods.balanceOf(accountAd).call();
      setbalance(web3.utils.fromWei(users));
    } catch (error) {
      console.log("data", error);
    }
  };

  const getAccounts = async () => {
    const web3 = window.web3;
    try {
      let accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      return accounts;
    } catch (error) {
      console.log("Error while fetching acounts: ", error);
      return null;
    }
  };

  const loadWeb3 = async () => {
    let isConnected = false;
    try {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        isConnected = true;
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        isConnected = true;
      } else {
        isConnected = false;
      }
      if (isConnected === true) {
        let accounts = await getAccounts();
        let accountDetails = null;
        setAccount(accounts[0]);
        accountAd = accounts[0];
        window.ethereum.on("accountsChanged", function (accounts) {});
        setAccount(accounts[0]);
        accountAd = accounts[0];
      }
      getData();
    } catch (error) {
      console.log("Error while connecting metamask", error);
    }
  };

  const enterAmountCall = async (e) => {
    try {
      setEnterAmount(e.target.value);
    } catch (error) {
      console.log("Error while checking locked account", error);
    }
  };

  const maxClc = async (e) => {
    try {
      setEnterAmount(balance);
    } catch (error) {
      console.log("Error while checking locked account", error);
    }
  };

  const swapTokens = async () => {
    const web3 = window.web3;
    try {
      let contract = new web3.eth.Contract(abi, contractAddress);
      let tokenContract = new web3.eth.Contract(tokenAbi1, tokenAddres1);
      await tokenContract.methods
        .approve(contractAddress, web3.utils.toWei(enterAmount))
        .send({
          from: account,
        })
        .then(async (output) => {
          let dailyprofit = await contract.methods
            .swapTokens(web3.utils.toWei(enterAmount))
            .send({
              from: account,
            })
            .then(async (output) => {
              console.log("Transaction Completed");
            })
            .catch((e) => {
              console.log("response", e);
            });
        })
        .catch((e) => {
          console.log("response", e);
        });
    } catch (error) {
      console.log("Error while fetching acounts: ", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="Header">
        <div className="container">
          <div className="row">
            <div className="col-md-2 headerimg1">
              <img src={logo} width="100px" alt="logo" />
            </div>
            <div className="col-md-2 headerimg1">
              <h3 className="h3">
                <b>COINHUNTERS</b>
              </h3>
            </div>
            <div className="col-md-3 offset-md-4 headerbtn">
              <button className="connect" onClick={loadWeb3}>
                {account}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="headerbar">
        <div className="container">
          <div className="row mx-3 row1">
            <div className="col-md-4" id="headerbar">
              <h3 id="h3">
                <b>How To Use Coinhunters</b>
              </h3>
              <p id="span1">
                <b id="span">Step 1:</b> Connect Wallet
              </p>
              <p id="span1">
                <b id="span">Step 2:</b> Swap V1 For V2
              </p>
              <p id="span1">
                <b id="span">Step 3:</b> Add New Token To Your Wallet
              </p>
            </div>

            <div className="col-md-4 offset-md-4">
              <div className="card p-3 rounded-3">
                <div>
                  <h5>Exchange Tokens</h5>
                  <p>Trade CHTRv1 in an instant</p>
                </div>
                <div className="floatingInputrght">
                  <span>Balance: </span>
                  <span>{balance}</span>
                </div>

                <div className="nputdv">
                  <input
                    min="0"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Enter amount"
                    onChange={enterAmountCall}
                    value={enterAmount}
                  />

                  <button className="connect" onClick={maxClc}>
                    max
                  </button>
                </div>

                <button
                  href="#"
                  className="btn btn-warning my-3 py-3 text-white"
                  onClick={swapTokens}
                >
                  Swap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Swap;
