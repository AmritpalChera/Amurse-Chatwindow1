import { Button } from 'antd';
import React from 'react';
import './App.css';


import FloatingMessageArea from './components/index';

const token = "OFNjOZRNzb0934yd6Ir8xabEo9Ytr07Kg8oM5vaT0VTLzxlIs7HA0E6CsOSn";
function App() {

  const handleAccounts = async () => {
    await window.ethereum.request({method: 'eth_requestAccounts'});
  };


  return ( 
    <div>
      <Button type="primary" onClick={handleAccounts}>Connect</Button>
      <FloatingMessageArea  receiverToken={token} />
    </div>
 
  );
}

export default App;
