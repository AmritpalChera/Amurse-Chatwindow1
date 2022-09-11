
import { axiosAccess, axiosUser } from './helpers/axios/axios'
import React,  {
  useEffect, useState,
} from 'react';
import {TiArrowSortedDown, TiArrowSortedUp,
} from 'react-icons/ti';
import { appError, appMessage } from './helpers';



import MainPage from './MainPage/MainPage';
import MessagePage from './MessagePage/MessagePage'
import ConnectWallet, { connectSilentlyMetamask } from './Connect/ConnectWallet';
import { signMessageMetamask } from './Connect/SignMessage';
import PusherLoader from './Pusher';

// Don't render this on mobile
export const ChatWindow = (props) => {
  const { interCom, receiverToken, customAddress, refresh, tag } = props;

  const [loading, setLoading] = useState(true);

  const [chat, setChat] = useState({ tag: tag });
  const setChatData = (data) => setChat({...chat, ...data});

  const [user, setUser] = useState({});
  const setUserData = (data) => { setUser({ ...user, ...data }) };

  const [mounted, setMounted] = useState(false);
  const [pusherMounted, setPusherMounted] = useState(false);


  const validateToken = async () => {
    let tokenAddress = await axiosAccess.post('/validateToken', { token: receiverToken });
    const toSet = { ...chat, ownerAddress: tokenAddress.data };
    if (interCom) toSet.receiverAddress = toSet.ownerAddress;
    if (tokenAddress.data) setChat(toSet);
    else appError("Couldn't validate token");
    setLoading(false);
  }

  useEffect(() => {
    if (user._id) validateToken();
  }, [user._id]);

  useEffect(() => {
    if (customAddress && !interCom && user.address) {
      setChatData({ receiverAddress: customAddress, open: true, userConversation: {} })
    }
  }, [refresh])
  


  const toggleFloat = () => {
    if (!user.address) return appMessage('Connect Wallet');
    else if (loading) return appMessage('Loading...')
    else if (!chat.ownerAddress) return appMessage('Service down')
    setChat({...chat, open: !chat.open});
  };

  const getHeight = () => {
    if (chat.open) return '600px';
    return '48px';
  };

  useEffect(() => {
    connectSilentlyMetamask(setUserData, appError)
    setMounted(true);
  }, []);


  const getUser = async () => {
    const https = window.location.protocol === 'https:';
    let userInfo;
    if(https) userInfo = await axiosUser.post('/loginValidate', { address: user.address }).then((res => res.data))
    let signature;
    if (!userInfo || !userInfo._id) {
      signature = await signMessageMetamask('PLEASE VERIFY OWNERSHIP', user.address);
      userInfo = (await axiosUser.post('/login', { address: user.address, signature: signature })).data;
    }
    setUser({...userInfo, signature})
    //after getting user, get conversation
  }

  useEffect(() => {
    if (user.address && !user._id) {
      getUser()
    }
    // eslint-disable-next-line
  }, [user.address]);

  const ToggleButton = () => {
    return (
      <div>
        {!chat.open ? <TiArrowSortedUp onClick={toggleFloat} className='amurse_textBig amurse_hover' /> :
            <TiArrowSortedDown onClick={toggleFloat} className='amurse_textBig amurse_hover '/>
         }
      </div>
    )
  }

  

//  useEffect(() => {console.log("Chat is: ", chat)}, [chat]) 
//  useEffect(() => {console.log("User is: ", user)}, [user])

  return (

    <div className="floatingMessageAreaContainer">

      <div className="floatingMessageArea" style={{height: getHeight()}}>
        <div className="floatingMessageAreaContent">

          <div className='amurse_flex amurse_width100 amurse_alignCenter'>
            <div className='amurse_flex amurse_alignCenter amurse_flex1 amurse_textBig amurse_bold amurse_blue amurse_padding8' onClick={toggleFloat}>
                            Messages
            </div>
            <div className='amurse_padHorSmall'><ToggleButton /></div>
            
            {mounted && <ConnectWallet setUserData={setUserData} setChatData={setChatData} />}
          </div>
          {mounted && user && user._id && !chat.receiverAddress && !interCom && pusherMounted &&  <MainPage user={user} setChatData={setChatData} />}
          {mounted && chat.receiverAddress && pusherMounted && <MessagePage
            chat={chat}
            setChatData={setChatData}
            user={user}
            interCom={interCom}
            tag={tag}
          />}
        </div>
      </div>
      {user.address && chat.open && <PusherLoader setPusherMounted={setPusherMounted} />}
    </div>

  );
};

export default ChatWindow;
