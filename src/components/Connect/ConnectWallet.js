import React, { useEffect } from 'react';
import Web3 from 'web3';

//validate ethreum address
export const validateAddressEthereum = async (address) => {
  const valid = await Web3.utils.isAddress(address);
  return valid;
}

// if metamask already connected, return updated account
export const connectSilentlyMetamask = async (setUserData, errorHandler) => {
  if (window && window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    const web3 = window.web3;
    const networkId = await window.web3.eth.getChainId();
    let accounts;
    await web3.eth.getAccounts((err, result) => {
      if (err) return console.log(err)
      accounts = result;
    });
    if (networkId && networkId !== 1) {
      errorHandler('Please change netowrk to ETH Mainnet');
      return;
    }
    setUserData && setUserData({ address: accounts[0] });
    return accounts[0]
  }
  return null;
}


// auto updates accounts when they are changed
const ConnectWallet = (props) => {
  const { setUserData, redirect, setChatData } = props;
  const ethereum = window.ethereum;


  useEffect(() => {
    if (ethereum) {
      ethereum.on('accountsChanged', (accounts) => {
        setUserData && setUserData({ address: accounts[0] });
        setChatData && setChatData({ open: false });
        if (!accounts[0]) console.log('No Accounts detected');
      });
      ethereum.on('disconnect', () => {console.log('user has disconnects')});
    }
    // eslint-disable-next-line
  }, [ethereum]);
  return (
    <div>
      <span></span>
    </div>
  )
}

export default ConnectWallet