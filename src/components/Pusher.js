import React, {useEffect, useState} from 'react';
import Pusher from 'pusher-js';
import { userAddress } from '.';

export const pusher = new Pusher("97f25cbcbd8b4a017e8c", {cluster: 'us2'});


const PusherLoader = ({user}) => {
  //  DATA NEEDED

  // Conversations and Messages live time
  const [updatedConversation, setUpdatedConversation] = useState({});
  const [newConversation, setNewConversation] = useState({});

  useEffect(() => {
    // if (newConversation._id) dispatch(addNewConversation({ userConversation: newConversation }))
    console.log('newConvo: ', newConversation);
    // eslint-disable-next-line
    }, [newConversation])

  useEffect(() => {
    // if (updatedConversation._id) dispatch(shiftFloatConversation({ conversation: updatedConversation }))
    console.log('updated convo: ', updatedConversation);
    // eslint-disable-next-line
    }, [updatedConversation])


  useEffect(() => {
    if (userAddress) {
      const channel = pusher.subscribe(userAddress);
      channel.bind('new-conversation', (response) => setNewConversation(response.data));
      channel.bind('update-conversation', (response) => setUpdatedConversation(response.data));
    }

    return () => {
      pusher.unsubscribe(userAddress);
    };
  }, [userAddress]);


  // DISCONNECT********************************************
  useEffect(() => {
    return () => {
      pusher.unbind_all();
      pusher.disconnect();
    };
  }, []);

  return <span></span>;
};

export default PusherLoader;
