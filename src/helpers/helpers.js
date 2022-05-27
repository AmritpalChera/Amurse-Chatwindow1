import {message} from 'antd';
import axios from '../axios';
import web3 from 'web3';


export function openInNewTab(url) {
  window.open(url, '_blank');
}

export const appMessage = (msg) => {
  return message.info({content: msg, className: 'messageAntd'});
};

export const appError = (msg) => {
  return message.error({content: msg, className: 'messageAntd'});
};

export const disconnectUser = async () => {
  await axios.post('/api/user/logoutUser');
  window.location.href = '/';
};

export const formattedWalletAddress = (address) => {
  const first = address.substring(0, 5);
  const addressLength = address.length;
  const second = address.substring(addressLength - 4, addressLength);
  return (`${first}...${second}`);
};

export const contactButtonClicked = async (data, setChat) => {
  const {senderAddress, receiverAddress} = data;

  if (!receiverAddress) return appError('User address not found');
  if (!senderAddress) return appMessage('Connect Wallet');
  if (!web3.utils.isAddress(receiverAddress)) return appError('Invalid Address');
  if (senderAddress.toLowerCase() === receiverAddress.toLowerCase()) return appMessage('Can\'t message yourself');

  let conversation = (await axios.post('/api/convo/getConversation', {receiverAddresses: [receiverAddress], senderAddress})).data;
  if (!conversation) conversation = (await axios.post('/api/convo/createConversation', {receiverAddresses: [receiverAddress], senderAddress})).data;
  if (conversation) setChat({ address: receiverAddress, page: 'messagepage', userConversation: conversation });
  else appError('Something went wrong');
};

