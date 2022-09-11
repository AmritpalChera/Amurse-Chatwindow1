import { message } from 'antd';
import { amurseNPM_axiosChat, axiosUser} from './helpers/axios/axios'
import Web3 from 'web3';


export function openInNewTab(url) {
  if (!window) return;
  window.open(url, '_blank');
};

export const getAddressKey = () => {
  return Math.floor(Math.random() * 300);
}


export const appMessage = (msg) => {
  return message.info({content: msg, className: 'messageAntd'});
};

export const appError = (msg) => {
  return message.error({content: msg, className: 'messageAntd'});
};

export const disconnectUser = async () => {
  await axiosUser.post('/api/user/logoutUser');
};

export const formattedWalletAddress = (address) => {
  const first = address.substring(0, 5);
  const addressLength = address.length;
  const second = address.substring(addressLength - 4, addressLength);
  return (`${first}...${second}`);
};


export const contactButtonClicked = async (data, setChat, user) => {
  const { senderAddress, receiverAddress } = data;
  if (!receiverAddress) return;
  if (!senderAddress) return appMessage('Connect Wallet');
  if (senderAddress.toLowerCase() === receiverAddress.toLowerCase()) return appMessage('Can\'t message yourself');
  let conversation = (await amurseNPM_axiosChat.post('/getConversation', {addresses: [receiverAddress, senderAddress], address: senderAddress, signature: user.signature})).data;
  if (!conversation) conversation = (await amurseNPM_axiosChat.post('/createConversation', {addresses: [receiverAddress, senderAddress], address: senderAddress, signature: user.signature})).data;
  if (conversation) setChat({ receiverAddress: receiverAddress, userConversation: conversation });
  else appError('Something went wrong');
  return;
};

