
import { axiosUser } from '../helpers/axios/axios'
import React,  {
  useEffect, useState,
} from 'react';
import {TiArrowSortedDown, TiArrowSortedUp,
} from 'react-icons/ti';
import {appMessage, contactButtonClicked} from './helpers';
import './FloatingMessageArea.css';
import MessagePage from './MessagePage/MessagePage';
import './antd.css'

export let userAddress = '';

// Don't render this on mobile
const FloatingMessageArea = (props) => {
  const [chat, setChat] = useState({});
  const setChatData = (data) => setChat({ ...chat, ...data });

  useEffect(() => {
    setChat({
      receiverAddress: props.receiverAddress,
      messages: [],
    });

  }, [])

  const [user, setUser] = useState({});

  // message methods

  const addChatMessage = (data) => {
    const {message} = data;
    const messages = chat.messages;
    messages.push(message);
    setChat({...chat, messages});
  };

 


  const toggleFloat = () => {
    if (!user.address) return appMessage('Connect Wallet');
    else if (!chat.receiverAddress) return appMessage('Service down')
    setChat({...chat, open: !chat.open});
  };
  const getHeight = () => {
    if (chat.open) return '600px';
    return '48px';
  };

  const handleAccounts = async () => {
    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
    setUser({...user, address: accounts[0]});
    userAddress = accounts[0];
    window.ethereum.on('accountsChanged', function(accounts) {
      // Time to reload your interface with accounts[0]!
      setUser({...user, address: accounts[0]});
      userAddress = accounts[0];
    });
  };

  useEffect(() => {
    handleAccounts();
  }, []);

  
  const getConversation = () => {
    contactButtonClicked({senderAddress: user.address, receiverAddress: chat.receiverAddress}, setChatData)
  }

  const getUser = async () => {
    let userInfo = (await axiosUser.post('/login', { address: user.address })).data;
    console.log('user is: ', userInfo)
    setUser(userInfo)
    //after getting user, get conversation
    getConversation();
  }


  useEffect(() => {
    if (user.address) getUser()
  }, [user.address])


  return (

    <div className="floatingMessageAreaContainer">

      <div className="floatingMessageArea" style={{height: getHeight()}}>
        <div className="floatingMessageAreaContent">

          <div className='flex width100 align-center'>
            <div className='flex align-center flex1 textBig bold blue padding8' onClick={toggleFloat}>
                            Messages
            </div>
            {!chat.open ? <TiArrowSortedUp onClick={toggleFloat} className='textBig hover' /> :
                            <TiArrowSortedDown onClick={toggleFloat} className='textBig hover '/>
            }
          </div>
          {chat.userConversation && chat.messages && <MessagePage
            addChatMessage={addChatMessage}
            chat={chat}
            setChat={setChatData}
            user={user}
          />}
        </div>

      </div>
    </div>

  );
};

export default FloatingMessageArea;
