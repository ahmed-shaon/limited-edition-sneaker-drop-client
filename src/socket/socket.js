import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';

const socket = io(URL, {
  autoConnect: false, // manually connect after user is authenticated
});

export default socket;