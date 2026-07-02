import style from './settings.module.css';
import { UserIcon, Settings, ShieldIcon, BlockeIcon, PlusIcon } from "../../iconhelper/iconHelper";
import { useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { notify } from '../../norifications/notifications';

const SettingPanel = ({modStatus, channelId, members}) =>{
    const {auth, reAuth, handleCurrentChannel, currentChannel,updateApp, goTo} = useOutletContext();
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
    const leaveGroup = async(connection)=>{
        try{
            if(!auth.user) throw new Error('User not authenticated')
            //validate that connection is not to global channel
            if(currentChannel === 1) throw new Error('Can not remove From Global Group')
            
            const response = await fetch(`http://localhost:3000/channel/${currentChannel}/leave`,{
            method: "DELETE",
            headers: {
                "Content-Type": 'Application/json',
                "Authorization": `Bearer ${auth.accessToken}`,
            },
            body: JSON.stringify({
                relationId: connection.id,
            })
            })
            await reAuth(response);//handels 401 and 403 cases
            const result = await response.json()
            //validate response status and return result message
            if(!response.ok)throw new Error(`${result.message}`)
            notify.success(result)
            handleCurrentChannel(1)
            updateApp()
            goTo('/')  
        }catch(err){
            notify.error(err)
        }
    }
    const populateCard = (data) =>{
        if (!data) return 'no members yet!'
        return data.map(member =>{
            return(
                <div key={member.user.id}  className={style.memberCard}>
                    {member.isMod?(
                        <>
                            <ShieldIcon />
                        </>
                    ):(
                        <>
                            <UserIcon />
                        </>
                    )}
                    @{member.user.name}
                    {member.isMod?(
                        <div>Disable Mod</div>
                    ):(
                        <div>Enable Mod</div>
                    )}
                    
                    <div><BlockeIcon /></div>

                </div>
            )
        }) 
    }
    const populateReqs = (data) =>{
        if(!data) return
        console.log(data)
        return data.map(request =>{
            return(
                <div key={request.id} className={style.reqCard}>
                    {request.user.photo? (
                        <img alt='user photo' src={request.user.photo} />
                    ):(
                        <UserIcon size={40}/>
                    )}
                    <div>
                        {request.user.name}
                    </div>
                    <div className={style.reqOptions}>             
                            <PlusIcon size={40}/>
                            <BlockeIcon size={40}/>                     
                    </div>

                </div>
            )
        })
    }
    const getPendingRequests = async() =>{
        try{
            if(!auth.user) throw new Error('User not authenticated')
            //validate that connection is not to global channel
            if(currentChannel === 1) throw new Error('Can not remove From Global Group')
            
            const response = await fetch(`http://localhost:3000/channel/${currentChannel}/mod/joinreq`,{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${auth.accessToken}`,
            },
            })
            await reAuth(response);//handels 401 and 403 cases
            const result = await response.json()
            //validate response status and return result message
            if(!response.ok)throw new Error(`${result.message}`)
            return result
        }catch(err){
            notify.error(err)
        }    
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
        if(pendingReq){
            const getRequests = async()=>{
                //gets pending requests
                const result = await getPendingRequests() 
                setRequests(result)      
            }
            getRequests();
        }
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
                    <button style={{padding: '20px'}}
                        onClick={()=>{
                            const confirm = window.confirm('This action will remove you from the channel!')
                            if(!confirm) return
                            // find specific member  connection to group
                            const user = members.find(member =>{
                                return member.user.id === auth.user.id
                            })
                            leaveGroup(user)
                        
                        }}
                    >Leave channel</button>
                </div>
                                
            </div>

            {modStatus? (
                <div className={style.modTools}>
                    <div className={style.modBanner}>
                        <ShieldIcon size={40}/>
                        Moderation panel
                    </div>
                    <div className={style.modOptions }>
                        <div 
                            style={{}}
                            className={
                            !pendingReq? style.activeOption: style.inactiveOption
                            }
                            onClick={()=>{
                                setPendingReq(false)
                            }}
                        >
                            Members
                        </div>
                        <div 
                            style={{}}
                            className={
                            pendingReq? style.activeOption: style.inactiveOption
                            }
                            onClick={()=>{
                                setPendingReq(true)
                            }}
                        >
                            pending Requests
                        </div>
                    </div>
                    <div className={style.activeOptionContainer}>
                            {pendingReq?(
                                <>
                                    {!requests? (
                                        <>Loading...</>
                                    ):(
                                        <>{populateReqs(requests)}</>
                                    )}
                                </>
                            ):(
                                <>
                                {!members? (
                                    <>Loading...</>
                                    ):(
                                    <>{populateCard(members)}</>
                                    )}
                                </>
                            )}
                    </div>
                    {/*
 
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