export const signMessageMetamask = async (message, userAddress) => {
  const web3 = window.web3;
  let pass = (Math.random() + 1).toString(36).substring(2);
  
  const signature = await web3.eth.personal.sign(message, userAddress);
  return signature;
}

export const verifyMessageMetamask = async (message, userAddress, signature) => {
  const web3 = window.web3;
  const _userAddress = await web3.eth.personal.ecRecover(message, signature);
  if (userAddress === _userAddress) return true;
  return false;
}


