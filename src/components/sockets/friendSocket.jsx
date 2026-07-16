 import { socket } from "./mainSocket";    

const freindIsOnline = () =>{
    if(!socket) return
    socket.emit('friend_online');    
}
const recievefriend = (handler)=>{
    socket.on('friend_online',(data)=>{
        console.log(`new friend online!`)
        console.log(data)
        console.log(chnls)
        setChnls(prev=>({
          ...prev,friends: prev.friends.map(f=>{
            if(f.id === data.id){
              return{...f,isOnline: data.isOnline}
            }
          })
        }))
    })   
}
      
const ioListener= {}
const ioSender = {}
export {
    ioListener,
    ioSender
}