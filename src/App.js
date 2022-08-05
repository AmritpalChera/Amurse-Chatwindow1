import { Button } from 'antd';
import React from 'react';
import './App.css';


import FloatingMessageArea from './components/index';

const token = "$2b$10$j1ncsKa23/.vY/4uAvd4UeGXQBWYREHqQvLMm/KMs.pTUtKm4ZOee";
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
