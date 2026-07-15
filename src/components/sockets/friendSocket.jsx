      socket.emit('friend_online');
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