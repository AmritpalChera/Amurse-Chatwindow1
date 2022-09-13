import React, { useEffect } from 'react';
import {MetaMask} from '@amurse/connect_sdk';


//validate ethreum address
export const validateAddressEthereum = async (address) => {
  const valid = await MetaMask.validateAddress(address);
  return valid;
}

// if metamask already connected, return updated account
export const connectSilentlyMetamask = async (setUserData, errorHandler) => {
  let connectedAccount = await MetaMask.connectSilently(errorHandler);
  if (connectedAccount) {
    setUserData && setUserData({ address: connectedAccount });
    return connectedAccount;
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