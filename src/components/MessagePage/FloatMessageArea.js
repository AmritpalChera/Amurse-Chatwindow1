import React, {useEffect, useRef} from 'react';
import { Avatar } from 'antd';
import './FloatMessageArea.css'
import {UserOutlined} from '@ant-design/icons';

const FloatMessageArea = (props) => {
  const {chat, user} = props;
  const floatArea = chat;
  const messages = floatArea.messages;

  const targetInfo = floatArea.userConversation?.recepientAddresses[0];

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

  const getFormattedMessage = (message, index) => {
    let messageAvatar;
    let displayName;
    if (message.address === (user.address)) {
      messageAvatar = user.profilePicture;
      displayName = user.username;
    } else {
      messageAvatar = targetInfo.user?.profilePicture;
      displayName = targetInfo.user?.username || 'Anonymous';
    }
    const date = new Date(message.created_at).toLocaleTimeString();

    let previousMessageDate;
    if (index > 0) {
      previousMessageDate = new Date(messages[index - 1].created_at)
          .toDateString();
    }
    const thisMessageDate = new Date(message.created_at).toDateString();

    return (
      <div className="messageContainer" key={index}>
        {previousMessageDate !== thisMessageDate &&
          <div className="dateDisplay">{thisMessageDate}</div>}
        <div className="message">
          <div className="messageAvatar">
            <Avatar
              // src={messageAvatar && ENDPOINT_MEDIA_DOWNLOAD + 't_' + messageAvatar}
            icon={<UserOutlined />} />
          </div>
          <div className="messageContent">
            <div className="messageDivHeader">
              <span className="messageDivHeaderName">{displayName}</span>
              <span className="messageDivHeaderTime">{date}</span>
            </div>
            <div className="messageDivContent">
              {/* {parse(message.text)} */}
              {message.text}
            </div>
          </div>


        </div>
      </div>

    );
  };


  return (
    <div className='floatMessageArea flex1 flex flexCol'>
      <div className='floatMessageAreaHeader'></div>
      <div className='flex1 flex flexCol justify-end'>
        {
          messages.map((message, index) => getFormattedMessage(message, index))
        }
        {
          messages.length === 0 && <h4 className='gray'>Send your first text...</h4>
        }
        <AlwaysScrollToBottom/>
      </div>
    </div>
  );
};

export default FloatMessageArea;
