import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:5000' 
  : import.meta.env.VITE_API_BASE_URL;

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false, 
});