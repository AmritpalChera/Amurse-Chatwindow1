import {UserOutlined} from '@ant-design/icons';
import {Avatar} from 'antd';
import React, { useEffect, useState } from 'react';
import { formattedWalletAddress } from '../helpers';


const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ConversationCard = (props) => {
  const { convo, setChatData, userAddress } = props;
  const [convoTarget, setConvoTarget] = useState('');


  const setReceiverAddress = () => {
    const receiverAddresses = convo.recepientAddresses.filter((address) => address !== userAddress);
    receiverAddresses && setChatData({receiverAddress: convoTarget, userConversation: {_id: convo._id}})
  }

  useEffect(() => {
    if (convo) {
      const receiverAddresses = convo.recepientAddresses.filter((address) => address !== userAddress);
      receiverAddresses && setConvoTarget(receiverAddresses[0])
    }
    
  }, [convo]);

  const date = new Date(convo.recentUpdateTime);
  const displayName = formattedWalletAddress(convoTarget);

    return (
      <div className="floatConvocardItem unselectable hover" onClick={() => { setReceiverAddress() }}>
            <div className="flex width100 hover hoverSelect">
                <div className="convoCardAvatar">
                    <Avatar style={{ backgroundColor: 'white' }} size={32} icon={<UserOutlined style={{ color: 'black'}}/>} />
                </div>
                <div className="floatConvocardContent hover width100">
                    <div className="flex justifySpaced align-center">
                        <span className='textMed text500'>{displayName}</span>
                        <span className="textMed gray">{month[date.getMonth()]} {date.getDate() }</span>
                    </div>
                    <div className="floatConvocardAddress gray">{convoTarget.address}</div> 
                    <div className="textSmall text500 gray">{convo.recentMessage}</div>   
                </div>
            </div>
        </div>
        
  );
};

export default ConversationCard;
