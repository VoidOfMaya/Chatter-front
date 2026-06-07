import { useEffect, useState } from 'react';
import style from './channel.module.css';
import { ChatInterface } from './chatInterface/chatinterface';
import {messages} from '../../mock/data'; // is a mock file simulating backend data
import { ChatLog } from './chatlog/chatlog';
import { redirect, useNavigate, useOutletContext } from 'react-router-dom';
import { notify } from '../norifications/notifications';

const Channel = () =>{
    //context
    const{ 
        auth, 
        channelData,
        chatLoader
    }= useOutletContext();
    const direct = useNavigate();

    //handels sidebar interactive actions touch and click
    const [chnlMsgs, setChnlMsgs] = useState(null);
    //on initialization
    useEffect(()=>{
        if(!auth) direct('/')
        setChnlMsgs(messages);
    },[])

    if(chatLoader){
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
            <div className={style.chatDisplay}> 
                {chnlMsgs? (
                    <ChatLog messages={channelData.messages} users={channelData.members} />                       
                ):('no chat open!')}    
            </div>
            <ChatInterface />
        </main>
        
    )
}
export{
    Channel
}