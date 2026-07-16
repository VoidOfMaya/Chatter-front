import { useEffect, useRef, useState } from 'react';
import style from './channel.module.css';
import { ChatInterface } from './chatInterface/chatinterface';
import { ChatLog } from './chatlog/chatlog';
import { redirect, useNavigate, useOutletContext } from 'react-router-dom';
import { notify } from '../norifications/notifications';
import { FriendsIcon, GroupIcon, Logout, Settings } from '../iconhelper/iconHelper';
import { SettingPanel } from './moderation/settings';

const Channel = () =>{
    //context
    const{ 
        auth, 
        channelData,
        chatLoader,
        populateChannelData,
        getChannel,
        currentChannel,
        members,
        goTo,
        socket
    }= useOutletContext();
    // is user a mod
    const [isMod, setIsMod] = useState(false);
    //channel message
    const [chnlMsgs, setChnlMsgs] = useState(null);
    //updates channel data on new message from user
    const [messageIndicator, setMessageIndicator]= useState(false);
    //handels reply to a message
    const [reply, setReply] = useState(null)
    // handels edit own message mode
    const [editMode, setEditMode] = useState(null);
    //populates channel name
    const [channelName, setChannelName]= useState('');
    //handels toggle between chatlog or setting
    const [settingsMode, setSettingsMode] = useState(false)
    //user is typing state:
    const [isTyping, setIsTyping] = useState(false);
    const [currentlyTyping, setCurrentlyTyping] = useState([])
    //CHAT interface state:
    const [message, setMessage]= useState('')
    const handleMessage =(data)=>{
        setMessage(data);
    }
    const typingTimer = useRef(null)
    //state handler functions:-
    const handleTyping =(stat)=>{
        setIsTyping(stat)
    }
    //on initialization
    //get friend id:
    const getFriendId = (data) =>{
        return data.members.find(member=>member.user.id !== auth.user.id)

    }
    const handleReply = ({id, name}) =>{
        setReply({id, name})
    }
    const cancleReply = () =>{
        setReply(null)
    }
    const getMods = () =>{
        return channelData.members.filter(user => user.isMod)
    }
    const handleEditing = (id, message)=>{
        setEditMode({id, message})
    }
    const resetEditor = () =>{
        setEditMode(null)
    }
    //handels namin friendchannels
    const getChannelName = (data) =>{
        if(!data) return
        if(data.type === 'FRIEND'){
            const channel = data.members.find(relation=>{
                return relation.user.id !== auth.user.id
            })   
            return channel.user.name         
        }else if(data.type === 'GROUP'){
            return data.name
        }

    }
    //socket handler
    const typeEventHandler = (data) =>{
        setIsTyping(true);
        setCurrentlyTyping(prev =>{
            const exists = prev.some(
                user=> user.userId === data.userId
            )
            if(exists) return prev
            return[...prev,data]
        })
    }
    const endTypingEvent = (data)=>{
        setIsTyping(false);
        setCurrentlyTyping(prev=>
            prev.filter(user => user.userId !== data.userId)
        )
    }
    const typeEvent =()=>{
        clearTimeout(typingTimer.current)
        socket.current.emit('typing_to',{id: currentChannel})
        //createTimeout
        typingTimer.current = setTimeout(() => {
            socket.current.emit(`stop_typing`,{id: currentChannel})

        }, 2000);
    }
    useEffect(()=>{
        setSettingsMode(false)
        console.log('socketMounted')
        socket.current.emit("view_channel", {id :currentChannel})
        socket.current.on('is_typing',typeEventHandler)
        socket.current.on('not_typing',endTypingEvent)
        return ()=>{
            if(!socket.current) return
            socket.current.off('is_typing',typeEventHandler)
            socket.current.off('not_typing',endTypingEvent)
        }
    },[currentChannel])
    useEffect(()=>{
        if(!auth.user){
            redirect('/');
            return
        } 
        if(!messageIndicator) return;
        const loadChannel = async() =>{
            const result = await getChannel(currentChannel)
            populateChannelData(result)
        }
        loadChannel()

        setMessageIndicator(false)
    },[messageIndicator])
    useEffect(()=>{
        if(!auth?.user){
            redirect('/')
            return
        }
        if(!channelData)return
        //loads name
        const name = getChannelName(channelData);
        //loads channel messages
        const sortedChat = channelData.messages.sort(
            (a,b)=> new Date(a.createdAt) - new Date(b.createdAt)
        )  
        setChannelName(name)
        setChnlMsgs(sortedChat)
        const modsList = getMods();
        //checks if user exists within mod list
        setIsMod(modsList.some(record => record.user.id === auth.user.id))
    },[channelData])
    useEffect(()=>{
        typeEvent()
    },[message])
    if(!auth?.user) return null;
    //handels loading states on init and on new message
    if(!channelData) return null;
    
    if(chatLoader && !chnlMsgs){
        return(
            <div style={{
                justifySelf: 'center', 
                alignSelf: 'center'
            }}>
                Please wait, Loading ...
            </div>
        )
    }
    //extracts friend name

    return(
        <main className={style.channel}>
            <div className={style.channelBanner}>
                {channelData.type === 'FRIEND'?(
                    <div style={{marginLeft: '20px'}}>
                        <FriendsIcon size={40} 
                        fn={()=>{
                            try {
                                const friend = getFriendId(channelData);
                                goTo(`/profile/${friend.user.id}`);
                            } catch(err) {
                                notify.error(err.message)
                                console.error(err);
                            }
                        }}
                        />                    
                    </div>
                ):(
                    <div style={{marginLeft: '20px'}}>
                        <GroupIcon size={40}/>                  
                    </div>
                )}
                <div style={{alignSelf: 'center'}}> 
                    @ {channelName}
                    </div>
                {/*check if current user is a mod on this channel*/}
                {channelData.type === 'GROUP'? (
                    <div style={{marginRight: '20px'}}>
                        {settingsMode?(
                            <Logout size={40} fn={()=>{
                            setSettingsMode(false)
                        }}/>
                        ):(
                        <Settings size={40} fn={()=>{
                            setSettingsMode(true)
                        }}/> 
                        )}                                          
                    </div>

                ):('')}
                 
            </div>
            {settingsMode?(
                <SettingPanel 
                modStatus={isMod}  
                channelId={currentChannel}
                members={members}
                />
            ):(
              <>
                <div className={style.chatDisplay}> 

                    {chnlMsgs? (
                        <ChatLog messages={channelData.messages} 
                                needsUpdate={setMessageIndicator}
                                handleReply={handleReply} 
                                isMod={isMod} 
                                handleEditing={handleEditing}
                                typing = {isTyping}
                                typingArray ={currentlyTyping}/>                       
                    ):('no chat open!')}    
                </div>
                <ChatInterface needsUpdate={setMessageIndicator}  
                            message={message}
                            handleMessage={handleMessage}
                            reply={reply} 
                            cancleReply={cancleReply}
                            editMode={editMode}
                            resetEditor={resetEditor}
                            setTyping= {handleTyping}
                            socket={socket}
                            typingEvent ={typeEvent}/>              
              </>      
                
            )}

        </main>
        
    )
}
export{
    Channel
}