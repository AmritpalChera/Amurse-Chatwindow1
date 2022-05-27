import axios from 'axios';
import {appError} from './helpers/helpers';
import {API_BASE_URL} from './routes';

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  credentials: 'include',

});

instance.interceptors.response.use((res) => res, (error) => {
  if (error.response.data === 'Session Expired') appError('Session Expired');
});

export default instance;
