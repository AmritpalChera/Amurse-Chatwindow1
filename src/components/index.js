
import { axiosAccess, axiosUser } from './helpers/axios/axios'
import React,  {
  useEffect, useState,
} from 'react';
import {TiArrowSortedDown, TiArrowSortedUp,
} from 'react-icons/ti';
import { appError, appMessage } from './helpers';
import './antd.css';
import './FloatingMessageArea.css';



import MainPage from './MainPage/MainPage';
import MessagePage from './MessagePage/MessagePage'
import ConnectWallet, { connectSilentlyMetamask } from './Connect/ConnectWallet';
import { signMessageMetamask } from './Connect/SignMessage';
export let userAddress = '';

// Don't render this on mobile
export const ChatWindow = (props) => {
  const { interCom, receiverToken } = props;

  const [loading, setLoading] = useState(true);

  const [chat, setChat] = useState({ });
  const setChatData = (data) => setChat({...chat, ...data});

  const [user, setUser] = useState({});
  const setUserData = (data) => { setUser({ ...user, ...data }) };


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
  }, [user._id])
  


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
  }, []);


  const getUser = async () => {
    const signature = await signMessageMetamask('PLEASE VERIFY OWNERSHIP', user.address);
    let userInfo = (await axiosUser.post('/login', { address: user.address, signature: signature })).data;
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
            
            <ConnectWallet setUserData={setUserData} setChatData={setChatData} />
          </div>
          {user && !chat.receiverAddress && !interCom && <MainPage user={user} setChatData={setChatData} />}
          {chat.receiverAddress && user.signature &&  <MessagePage
            chat={chat}
            setChatData={setChatData}
            user={user}
            interCom={interCom}
          />}
        </div>

      </div>
    </div>

  );
};

export default ChatWindow;
