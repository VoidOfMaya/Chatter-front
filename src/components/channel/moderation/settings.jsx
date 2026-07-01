import style from './settings.module.css';
import { GroupIcon, Settings, ShieldIcon } from "../../iconhelper/iconHelper";
import { useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { notify } from '../../norifications/notifications';

const SettingPanel = ({modStatus, channelId, members}) =>{
    const {auth, reAuth} = useOutletContext();
    const [ info, setInfo] = useState(null)
    const [ pendingReq, setPendingReq] = useState(false)
    const [requests, setRequests] = useState(null)
    const getInfo = async()=>{
        if(!auth.user)return
        const response = await fetch(`http://localhost:3000/channel/${channelId}/info`,{
        method: "GET",
        headers: {
            "Authorization": `Bearer ${auth.accessToken}`,
        },
        })
        await reAuth(response);//handels 401 and 403 cases
        return await response.json()
      
    }
    useEffect(()=>{
        const getGroupInfo = async()=>{
            try{
                const result = await getInfo()
                setInfo(result)
            }catch(err){
                notify.error(err)
            }
        }
        getGroupInfo()
    },[])
    useEffect(()=>{
        if(pendingReq){}
        if(!pendingReq){}
    },[pendingReq])
    if(!info){
        return(
            <>
                Loading...
            </>
        )
    }
    return(
        <div className={style.main}>
            <div className={style.userSettings}>
                <h3 style={{marginLeft: '20px'}}>Channel Settings   
                    <div style={{display: 'inline', color: '#383838'}}>
                        #{channelId}
                    </div>
                </h3>
                <div>{info.createdAt}</div>
                <div>{/* member count*/}</div>
                <div className={style.userOptions}>
                    <button style={{padding: '20px'}}>Leave channel</button>
                </div>
                                
            </div>

            {modStatus? (
                <div className={style.modTools}>
                    <div className={style.modBanner}>
                        <ShieldIcon size={40}/>
                        Moderation panel
                    </div>
                    <div className={style.modOptions }>
                        <div className={
                            !pendingReq? style.activeOption: style.inactiveOption
                            }
                            onClick={()=>{
                                setPendingReq(false)
                            }}
                        >
                            Members
                        </div>
                        <div className={
                            pendingReq? style.activeOption: style.inactiveOption
                            }
                            onClick={()=>{
                                setPendingReq(true)
                            }}
                        >
                            pending Requests
                        </div>
                    </div>
                    <div className={style.activeOption}>

                    </div>
                    {/*
                        -[] MOD: get all join requests by id
                        -[] MOD: approve join request by id
                        -[] MOD: reject join request by id
                        -[] MOD: remove user from group/ban
                        -[] MOD: enable mod Privillage
                        -[] MOD: remove mod privillage
                    */}

                </div>              
            ):('')}

        </div>
    )
}

export{
    SettingPanel
}