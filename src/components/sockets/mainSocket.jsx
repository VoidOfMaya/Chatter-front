import { io } from 'socket.io-client';
//SOCKET handler
let socket = null;
const connect = async (token) =>{
  if(socket) return socket;
    socket = io(`${import.meta.env.VITE_API_URL}`,{
      auth:{
        token: token,
      }
    })
    return socket 
  }
const disconnect = async () =>{
    if(!socket) return
    socket.disconnect();
    socket = null
  }
const wsio ={
    connect,
    disconnect  
}
  export {
    wsio
  }
