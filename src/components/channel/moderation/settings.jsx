import style from './settings.module.css';
import { UserIcon, Settings, ShieldIcon, BlockeIcon, PlusIcon } from "../../iconhelper/iconHelper";
import { useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { notify } from '../../norifications/notifications';

const SettingPanel = ({modStatus, channelId, members}) =>{
    const {
        auth, 
        reAuth, 
        handleCurrentChannel, 
        currentChannel,
        getChannel,
        populateChannelData,
        updateApp,
        goTo
    } = useOutletContext();
    const [ info, setInfo] = useState(null)
    const [ pendingReq, setPendingReq] = useState(false)
    const [requests, setRequests] = useState(null)
    // server action functions
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
    const removeUser = async (connectionId)=>{
        try {
            const response = await fetch(
                `http://localhost:3000/channel/${currentChannel}/mod/removeuser`,{
                method: 'DELETE',
                headers:{
                "Authorization": `Bearer ${auth.accessToken}`,
                "Content-Type": "Application/Json"
                },
                body:JSON.stringify({
                    relationId: connectionId
                })
            })
            await reAuth(response);//handels 401 and 403 cases
            const result = await response.json()
            //validate response status and return result message
            if(!response.ok)throw new Error(`${result.message}`)
            notify.success(result.msg)
            //refetch new updated channel data from server and update state
            const newChannelData= await getChannel(currentChannel);
            populateChannelData(newChannelData)
            //prompt app to rerender
            //updateApp();

        } catch (err) {
            notify.error(err)            
        }
    } 
    const acceptRequest = async (connectionId)=>{
        try {
            const response = await fetch(
                `http://localhost:3000/channel/${currentChannel}/mod/acceptreq`,{
                method: "PUT",
                headers: {
                    'Content-Type': 'Application/Json',
                    "Authorization": `Bearer ${auth.accessToken}`,
                },
                body: JSON.stringify({
                    relationId: connectionId
                })
            })
            if(!response.ok) throw new Error(`${response.message}`)
            const result = await response.json();
            notify.success(result.msg)    
            
            //refetch and update request array state
            const newReqList = await getPendingRequests() 
            setRequests(newReqList )
            //refetch channel data from server and update state
            const newChannelData= await getChannel(currentChannel);
            populateChannelData(newChannelData)
            updateApp()
               
        } catch (err) {
            notify.error(err)
        }
    }
    const rejectRequest = async (connectionId)=>{ 
        try {
            const response = await fetch(`http://localhost:3000/channel/${currentChannel}/mod/rejectreq`,{
                method: "DELETE",
                headers: {
                    'Content-Type': 'Application/Json',
                    "Authorization": `Bearer ${auth.accessToken}`,
                },
                body: JSON.stringify({
                    relationId: connectionId
                })
            })
            if(!response.ok) throw new Error(`${response.message}`)
            const result = await response.json();
            notify.warn(result.msg)
            //refetch channel data from server and update state
            const newChannelData= await getChannel(currentChannel);
            populateChannelData(newChannelData)
            updateApp()
        } catch (err) {
            notify.error(err)
        }
    }
    const enableMod =async()=>{
        console.log(`turn on mod premissions`)
    }
    const disableMod =async()=>{
        console.log(`turn off mod premissions`)
        //validate that there is more then one moderator
        //important to not lock group out of mod privilages 
    }
    //client render functions
    const populateCard = (data) =>{
        if (!data) return 'no members yet!'
        return data.map(member =>{
            return(
                <div key={member.user.id}  className={style.memberCard}>
                    {member.isMod?(<ShieldIcon />):(<UserIcon />)}
                    @{member.user.name}
                    {member.isMod?(
                        <div
                            className={style.disableOption} 
                            onClick={()=>{
                                const confirm = window.confirm(`this action will REMOVE Moderation level premission for ${member.user.name}, Are You Sure?`)
                                if(!confirm) return
                                disableMod()
                            }}
                        >
                            <h5>disable moderator role</h5>
                            <ShieldIcon color='#ee0d0d'/>-
                        </div>
                    ):(
                        <div
                            className={style.enableOption} 
                            onClick={()=>{
                                const confirm = window.confirm(`this action will GIVE Moderation level premission for ${member.user.name}, Are You Sure?`)
                                if(!confirm) return
                                enableMod()
                            }}
                        >
                            <h5>enable moderator role</h5>
                            <ShieldIcon color='green'/>+
                        </div>
                    )}
                    
                    <div><BlockeIcon fn={()=>removeUser(member.id)}/></div>

                </div>
            )
        }) 
    }
    const populateReqs = (data) =>{
        if(!data) return
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
                            <PlusIcon size={40} fn={()=> acceptRequest(request.id)}/>
                            <BlockeIcon size={40} fn={ async()=> rejectRequest(request.id)}/>                     
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
        if(!pendingReq){
            const updateTab = async()=>{
                const newChannelData= await getChannel(currentChannel);
                populateChannelData(newChannelData)
            }
            updateTab();
            //updateApp();
        }
    },[pendingReq])
    useEffect(()=>{

    },[])
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