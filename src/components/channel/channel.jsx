import { useEffect, useState } from 'react';
import style from './channel.module.css';
import { ChatInterface } from './chatInterface/chatinterface';
import { ChatLog } from './chatlog/chatlog';
import { redirect, useNavigate, useOutletContext } from 'react-router-dom';
import { notify } from '../norifications/notifications';
import { FriendsIcon, GroupIcon, ShieldIcon } from '../iconhelper/iconHelper';

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
    const direct = useNavigate();

    const [isMod, setIsMod] = useState(false)
    const [chnlMsgs, setChnlMsgs] = useState(null);
    const [messageIndicator, setMessageIndicator]= useState(false);
    const [reply, setReply] = useState(null)
    const [editMode, setEditMode] = useState(null);
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
    //const isUserMod = (userId)=>{
    //    if(!mods) return
    //    mods.some(record => record.user.id === userId)
    //}
    const handleEditing = (id, message)=>{
        setEditMode({id, message})
    }
    const resetEditor = () =>{
        setEditMode(null)
    }

  
    useEffect(()=>{
        if(!auth) return redirect('/');
        if(!messageIndicator) return;
        const loadChannel = async() =>{
            const result = await getChatlog(currentChannel)
            populateChannelData(result)
        }
        loadChannel()

        setMessageIndicator(false)
    },[messageIndicator])
    useEffect(()=>{
        if(!auth) return direct('/')
        if(!channelData)return
        const sortedChat = channelData.messages.sort(
            (a,b)=> new Date(a.createdAt) - new Date(b.createdAt)
        )  
        setChnlMsgs(sortedChat)
        console.log(`current user id: ${auth.user.id}`)
        const modsList = getMods();
        //checks if user exists within mod list
        setIsMod(modsList.some(record => record.user.id === auth.user.id))
    },[channelData])
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
                <div style={{alignSelf: 'center'}}> {channelData.name}</div>
                {/*check if current user is a mod on this channel*/}
                {isMod? (
                   <ShieldIcon size={30}/>  
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