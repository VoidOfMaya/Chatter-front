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
        reAuth, 
        currentChannel,
        channelData,
        handleChannelData 
    }= useOutletContext();
    const [loadingData, setLoadingData] = useState(true);
    const direct = useNavigate();
    
    //handels sidebar interactive actions touch and click
    const [chnlMsgs, setChnlMsgs] = useState(null);
    /*get data*/
    const getData = async(id) =>{
        try{
            const response = await fetch(`http://localhost:3000/channel/${id}`,{
                method: 'GET',
                headers: {
                    "Content-Type": 'Application/json',
                    "Authorization": `Bearer ${auth.accessToken}`,
                    },
            })
            await reAuth(response);//handels 401 and 403 cases
            const result = await response.json()
            setLoadingData(false)
            return result
        }catch(err){
            notify.error(err.message)
            redirect('/')
        }
    }
    //on auth state change
    useEffect(()=>{
        if(!auth) return
        const loadChannel = async() =>{
            const result = await getData(currentChannel);
            handleChannelData(result)
        }
        loadChannel();
        
    },[auth])
    //on initialization
    useEffect(()=>{
        if(!auth) direct('/')
        setChnlMsgs(messages);
    },[])
    if(loadingData){
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