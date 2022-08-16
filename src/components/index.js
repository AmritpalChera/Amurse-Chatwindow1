
import { axiosAccess, axiosUser } from './helpers/axios/axios'
import React,  {
  useEffect, useState,
} from 'react';
import {TiArrowSortedDown, TiArrowSortedUp,
} from 'react-icons/ti';
import {appError, appMessage, contactButtonClicked} from './helpers';
import './FloatingMessageArea.css';
import MessagePage from './MessagePage/MessagePage';
import './antd.css'
import Web3 from 'web3';
export let userAddress = '';

// Don't render this on mobile
export const ChatWindow = (props) => {
  const [chat, setChat] = useState({
    messages: []
  });
  const setChatData = (data) => setChat({ ...chat, ...data });
  const [user, setUser] = useState({});
  const ethereum = window.ethereum;


  const validateToken = async () => {
    let tokenAddress = await axiosAccess.post('/validateToken', { token: props.receiverToken });
    if (tokenAddress.data) setChat({ ...chat, receiverAddress: tokenAddress.data });
    else appError("Couldn't validate token");
  }

  useEffect(() => {
    validateToken();
  }, [props.receiverToken])



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


  const clearUserData = () => {
    setUser({})
    setChat({ open: false})
  }

  useEffect(() => {
    if (ethereum) {
      ethereum.on('accountsChanged', (accounts) => {
        setUser({...user, address: accounts[0]});
        if (!accounts[0]) clearUserData();
      });

      ethereum.on('disconnect', () => {
        clearUserData()
      }); 
    }
    // eslint-disable-next-line
  }, [ethereum]);


  const connectMetamaskSilently = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      const web3 = window.web3;
      const networkId = await window.web3.eth.getChainId();
      let accounts;
      await web3.eth.getAccounts((err, result) => {
        if (err) return console.log(err)
        accounts = result;
      });
      if (!networkId || !accounts[0]) return null;
      setUser({ ...user, address: accounts[0] });
    }
    return null;
  }

  useEffect(() => {
    connectMetamaskSilently();
  }, []);


  
  const getConversation = () => {
    contactButtonClicked({senderAddress: user.address, receiverAddress: chat.receiverAddress}, setChatData)
  }

  const getUser = async () => {
    let userInfo = (await axiosUser.post('/login', { address: user.address })).data;
    setUser(userInfo)
    //after getting user, get conversation
    getConversation();
  }

  useEffect(() => {
    if (user.address) getUser()
    // eslint-disable-next-line
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
          {chat.userConversation && <MessagePage
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

export default ChatWindow;
