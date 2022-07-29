import React from 'react';
import './App.css';


import FloatingMessageArea from './components/index';

const receiverAddress = '0xCB2F82eB852D4746e744168DC5D5B2a49b524A3c';
function App() {
  return ( 
    <FloatingMessageArea receiverAddress={receiverAddress}/>
  );
}

export default App;
