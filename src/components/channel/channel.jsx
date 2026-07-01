import { useEffect, useState } from 'react';
import style from './channel.module.css';
import { ChatInterface } from './chatInterface/chatinterface';
import { ChatLog } from './chatlog/chatlog';
import { redirect, useNavigate, useOutletContext } from 'react-router-dom';
import { notify } from '../norifications/notifications';
import { FriendsIcon, GroupIcon, Settings } from '../iconhelper/iconHelper';

const Channel = () =>{
    //context
    const{ 
        auth, 
        channelData,
        chatLoader,
        populateChannelData,
        getChatlog,
        currentChannel,
        goTo
    }= useOutletContext();

    const [isMod, setIsMod] = useState(false);
    const [chnlMsgs, setChnlMsgs] = useState(null);
    const [messageIndicator, setMessageIndicator]= useState(false);
    const [reply, setReply] = useState(null)
    const [editMode, setEditMode] = useState(null);
    const [channelName, setChannelName]= useState('')
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

  
    useEffect(()=>{
        if(!auth){
            redirect('/');
            return
        } 
        if(!messageIndicator) return;
        const loadChannel = async() =>{
            const result = await getChatlog(currentChannel)
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
    if (!auth?.user) return null;
    //handels loading states on init and on new message
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
                                console.log('start');

                                const friend = getFriendId(channelData);

                                console.log(friend);

                                console.log(
                                    'navigating to',
                                    `/profile/${friend.user.id}`
                                );

                                goTo(`/profile/${friend.user.id}`);

                                console.log('end');
                            } catch(err) {
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
                {isMod? (
                   <Settings size={40} fn={()=>{
                    goTo(`/settings/${currentChannel}`)
                   }}/>  
                ):('')}
                
            </div>
            <div className={style.chatDisplay}> 
                {chnlMsgs? (
                    <ChatLog messages={channelData.messages} 
                            needsUpdate={setMessageIndicator}
                            handleReply={handleReply} 
                            isMod={isMod} 
                            handleEditing={handleEditing}/>                       
                ):('no chat open!')}    
            </div>
            <ChatInterface needsUpdate={setMessageIndicator}  
                        reply={reply} 
                        cancleReply={cancleReply}
                        editMode={editMode}
                        resetEditor={resetEditor}/>
        </main>
        
    )
}
export{
    Channel
}