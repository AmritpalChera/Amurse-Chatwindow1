import React, {useEffect, useState} from 'react';
import './MessagePage.css';
import {Input} from 'antd';
import {SendOutlined} from '@ant-design/icons';
import { amurseNPM_axiosChat} from '../helpers/axios/axios'
import {pusher} from '../Pusher';
import FloatMessageArea from './FloatMessageArea';
import { appError, contactButtonClicked } from '../helpers';

const MessagePage = (props) => {
  const { user, chat, setChatData, interCom } = props;
  const [message, setMessage] = useState();

  const getConversation = () => {
    contactButtonClicked({senderAddress: user.address, receiverAddress: chat.receiverAddress}, setChatData, user)
  }  

  const addChatMessage = (data) => {
    const {message} = data;
    const messages = chat.userConversation?.messages;
    messages.push(message);
    setChatData({...chat, userConversation: {...chat.userConversation, messages: messages}});
  };

  const getMessages = async () => {
    if (!chat.userConversation?._id) {
      appError('something went wrong')
      return;
    }
    const messages = (await amurseNPM_axiosChat.post('/getMessages',
      { convoId: chat.userConversation?._id })).data;
    const userConvo = { ...chat.userConversation, messages: messages }
    let newChat = chat;
    newChat.userConversation = userConvo;
      setChatData(newChat);
  };

  // EXISTING MESSAGES
  useEffect(() => {
    if (!chat.userConversation?._id) {
      getConversation();
    };
    return () => setChatData({ receiverAddress: null, userConversation: {} });
    // eslint-disable-next-line
  }, [chat.receiverAddress]);

  useEffect(() => {
    if (chat.userConversation?._id) getMessages();
  }, [chat.userConversation && chat.userConversation._id])

  // PUSHER - NEW MESSAGES
  const [newMessage, setNewMessage] = useState({});
  useEffect(() => {
    newMessage.message && newMessage.message._id &&
      addChatMessage(newMessage);
    // eslint-disable-next-line
  }, [newMessage]);

  useEffect(() => {
    if (chat.userConversation?._id) {
      const channel = pusher.subscribe(
          chat.userConversation._id);
      channel.bind('new-message', (response) => setNewMessage(response.data));
    }
    return () => {
      chat.userConversation?._id &&
        pusher.unsubscribe(chat.userConversation._id);
    };
  }, [chat.userConversation]);
  // ______________________________________________________________________


  const returnToMain = () => setChatData({ receiverAddress: '' });

  const header = () => {
    return (
      <div className='flex'>
        {!interCom && <div onClick={returnToMain}
          className='hover mainPageHeader_amurse'>
           Return
        </div>}
      </div>
    );
  };

  const submitMessage = async () => {
    await amurseNPM_axiosChat.post('/createMessage', {
      address: user.address, text: message,
      owner: user._id,
      convoId: chat.userConversation._id,
      convoIndex: chat.userConversation.index || 0,
    });
    setMessage('');
  };

  const createMessage = () => {
    return (
      <div className='floatCreateMessage'>
        <Input
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          onPressEnter={submitMessage}
          maxLength={500}
          block="true"
          suffix={<SendOutlined
  
            className='hover' onClick={() => message && submitMessage()}
            style={{ color: message? 'var(--blue)' : 'gray'}} />}
          placeholder="Enter message..."
        />
      </div>
    );
  };

  return (
    <div className='floatMessagePage flex flexCol'>
      {header()}
      <FloatMessageArea chat={chat} user={user}/>
      {createMessage()}
    </div>

  );
};

export default MessagePage;
