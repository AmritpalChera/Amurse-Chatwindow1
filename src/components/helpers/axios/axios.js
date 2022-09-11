import axios from 'axios';

//PRODUCTION
// const CHAT_BASE = 'https://chat-dot-amurse.uk.r.appspot.com';
// const USER_BASE = 'https://user-dot-amurse.uk.r.appspot.com/api';
// const ACCESS_BASE = "https://access-dot-amurse.uk.r.appspot.com";

//LOCAL DEVELOPMENT
const CHAT_BASE = 'http://localhost:5001';
const USER_BASE =   'http://localhost:5002/api';
const ACCESS_BASE = 'http://localhost:5003';


const instanceCreater = (baseUrl) => {
  let instance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    credentials: 'include',

})

  return instance;
}



export const amurseNPM_axiosChat = instanceCreater(CHAT_BASE);
export const axiosUser = instanceCreater(USER_BASE);
export const axiosAccess = instanceCreater(ACCESS_BASE);