import { io } from 'socket.io-client';
//SOCKET handler
let socket = null;
const connect = (token) =>{
  if(socket) return socket;
    socket = io(`${import.meta.env.VITE_API_URL}`,{
      auth:{
        token: token,
      }
    })
    return socket 
  }
const disconnect = () =>{
    if(!socket) return
    console.log('disconnection socket')
    socket.disconnect();
    socket = null
  }
const wsio ={
    connect,
    disconnect  
}
  export {
    wsio,
    socket
  }
