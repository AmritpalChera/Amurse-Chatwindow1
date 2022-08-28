import React, {useEffect, useState} from 'react';
import {Input} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import { amurseNPM_axiosChat } from '../helpers/axios/axios';
import ConversationCard from './ConversationCard';
import { appMessage, contactButtonClicked,  } from '../helpers';
import { validateAddressEthereum } from '../Connect/ConnectWallet';


const MainPage = (props) => {
  const { user, setChatData } = props;
  const [conversations, setConversations] = useState([]);
  const [newAddress, setNewAddress] = useState('');

  const getConversations = async () => {
    //get wallet conversations
    let convos = await amurseNPM_axiosChat.post('/getConversations', { address: user.address, signature: user.signature })
      .then((res) => res.data).catch(err => console.log(err));
    // console.log('received convos 😎', convos)
    //set wallet conversations
    if (convos) setConversations(convos);
    
    // amurseNPM_axiosChat.post('/getConversations', {})
  }

  useEffect(() => {
    if (user._id) {
      getConversations();
    }
  }, [user._id]);

  const NoConversations = () => (
    <div className='amurse_blue amurse_bold amurse_textMed'>
            No Conversations
    </div>
  );

  const searchConversation = () => {
    if (!validateAddressEthereum(newAddress)) appMessage('Invalid Address');
    return contactButtonClicked({senderAddress: user.address, receiverAddress: newAddress}, setChatData, user) 
  }




  return (
    <div className='floatMessage amurse_padding8'>

      <div className='addressInput'>
        <Input
          block="true"
          maxLength={500}
          disabled={!user.signature}
          onChange={(e)=>setNewAddress(e.target.value)}
          suffix={<SearchOutlined className='amurse_hover' style={{ color: newAddress? 'var(--amurse_blue)': 'amurse_gray' }} onClick={searchConversation} />}
          placeholder="ETH address..."
          onPressEnter={searchConversation}
        />


      </div>
      <div className='recentConvos' style={{height: '80vh', marginTop: '8px'}}>
        {
          conversations[0] ? conversations.map((convo, index) =>
            convo && convo._id && <ConversationCard key={index} index={index} convo={convo} setChatData={setChatData} userAddress={user.address} />)
        : <NoConversations />
          }
      </div>
    </div>
  );
};

export default MainPage;
