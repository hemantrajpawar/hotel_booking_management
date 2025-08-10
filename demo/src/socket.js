import { io } from 'socket.io-client';

// Use the URL of your backend server
const URL = 'http://localhost:5000'; 
export const socket = io(URL, {
    autoConnect: false // We will connect manually when a component needs it
});