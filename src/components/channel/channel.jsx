import { useEffect, useState } from 'react';
import style from './channel.module.css';
import { ChatInterface } from './chatInterface/chatinterface';
import { ChatLog } from './chatlog/chatlog';
import { redirect, useNavigate, useOutletContext } from 'react-router-dom';
import { notify } from '../norifications/notifications';
import { FriendsIcon, GroupIcon } from '../iconhelper/iconHelper';

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

    //handels sidebar interactive actions touch and click
    const [chnlMsgs, setChnlMsgs] = useState(null);
    const [messageIndicator, setMessageIndicator]= useState(false);
    const [reply, setReply] = useState(null)
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
            </div>
            <div className={style.chatDisplay}> 
                {chnlMsgs? (
                    <ChatLog messages={channelData.messages} handleReply={handleReply} /*users={channelData.members}*/ />                       
                ):('no chat open!')}    
            </div>
            <ChatInterface needsUpdate={setMessageIndicator}  reply={reply} cancleReply={cancleReply}/>
        </main>
        
    )
}
export{
    Channel
}