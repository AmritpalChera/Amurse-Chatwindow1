import axios from 'axios';
// import { appError } from '../functions/general';

// const CHAT_BASE = process.env.NODE_ENV === 'production' ? 'https://chat-dot-amurse.uk.r.appspot.com' : 'http://localhost:5001';
// const USER_BASE = process.env.NODE_ENV === 'production' ? 'https://user-dot-amurse.uk.r.appspot.com/api' : 'http://localhost:5002/api';


//PRODUCTION
const CHAT_BASE = 'https://chat-dot-amurse.uk.r.appspot.com';
const USER_BASE = 'https://user-dot-amurse.uk.r.appspot.com/api';


//LOCAL DEVELOPMENT
// const CHAT_BASE = 'http://localhost:5001';
// const USER_BASE =   'http://localhost:5002/api';



const instanceCreater = (baseUrl) => {
  let instance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    credentials: 'include',

})

  return instance;
}



export const axiosChat = instanceCreater(CHAT_BASE);
export const axiosUser = instanceCreater(USER_BASE);
