import React, {useEffect, useState} from 'react';
import './MessagePage.css';
import {BiArrowBack} from 'react-icons/bi';
import {Input} from 'antd';
import {SendOutlined} from '@ant-design/icons';
import axios from '../../../axios';
import {pusher} from '../../../pusher/features/Pusher';
import FloatMessageArea from './FloatMessageArea';
import {appMessage} from '../../../helpers/helpers';

const MessagePage = (props) => {
  const {user, chat, setChat, addChatMessage} = props;
  const [message, setMessage] = useState();
  const floatMessage = chat;

  const getMessages = async () => {
    const messages = (await axios.post('/api/convo/getMessages',
        {convoId: floatMessage.userConversation?.conversation?._id})).data;
    setChat({messages: messages});
  };

  // EXISTING MESSAGES
  useEffect(() => {
    getMessages();

    return () => setChat({messages: [], conversation: {}});
  }, [chat.address]);

  // PUSHER - NEW MESSAGES
  const [newMessage, setNewMessage] = useState({});
  useEffect(() => {
    newMessage.message && newMessage.message._id &&
      addChatMessage(newMessage);
  }, [newMessage]);

  useEffect(() => {
    if (floatMessage.userConversation?.conversation?._id) {
      const channel = pusher.subscribe(
          floatMessage.userConversation.conversation._id);
      channel.bind('new-message', (response) => setNewMessage(response.data));
    }
    return () => {
      floatMessage.userConversation.conversation._id &&
        pusher.unsubscribe(floatMessage.userConversation.conversation._id);
    };
  }, [floatMessage.userConversation]);
  // ______________________________________________________________________


  const returnToMain = () => setChat({page: 'mainpage'});


  const header = () => {
    return (
      <div className='flex'>
        <div onClick={returnToMain}
          className='flex align-center hover blue bold'>
          {/* <BiArrowBack className='margin4right' /> Return */}
        </div>
      </div>
    );
  };

  const submitMessage = async () => {
    if (!message) return appMessage('No Content');
    await axios.post('/api/convo/createMessage', {
      address: user.address, text: message,
      owner: user._id,
      convoId: floatMessage.userConversation.conversation._id,
      receiverAddress: floatMessage.address,
      convoIndex: floatMessage.userConversation.conversation.index,
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
          block="true"
          suffix={<SendOutlined
            className='hover' onClick={submitMessage}
            style={{color: 'var(--blue)'}} />}
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
