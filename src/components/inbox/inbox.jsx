import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom"
import { BlockeIcon, PlusIcon, UserIcon } from "../iconhelper/iconHelper";
import style from './inbox.module.css';
import { notify } from "../norifications/notifications";
const Inbox = () =>{
    const{auth, reAuth,inbox, handleCurrentChannel,updateApp} = useOutletContext();
    const [inboxContent, setInboxContent] = useState(null)
    const populateRequests = (requestArray) =>{
        if (!requestArray)return
        return requestArray.map((request)=>{
            //console.log(request)
            return(
                <div key={request.id} className={style.card} >
                    {request.friend.photo? (
                        <img src={`${request.friend.photo}`}  alt="profile photo"/>
                    ):(
                        <UserIcon size={60} />
                    )}
                    {request.user.id === auth.user.id?(
                        //where user is the sender
                        <>
                        <h2>{request.friend.name}</h2>
                            <div className={style.options}>
                                <h3 style={{color: '#686868'}}>{request.status}</h3>                                
                            </div>
                        </>
                    ):(
                        //where user is the recipient
                        <>
                            <h2>{request.user.name}</h2>
                            <div className={style.options}>
                                <div    title="accept request">
                                        <PlusIcon size={35} focusColor="green" fn={async()=>{
                                            await acceptReq(request.id)          
                                        }}/>
                                </div>
                                <div title="reject request">
                                        <BlockeIcon size={35} focusColor="red" fn={async()=>{
                                            await rejectReq(request.id)
                                        }} />
                                </div>                         
                            </div>
                        </>
                    )}
                    {/*
                    <h2>{request.friend.name}</h2>
                    <div className={style.options}>
                        {request.user.id === auth.user.id?(
                            <h3 style={{color: '#686868'}}>{request.status}</h3>
                        ):(
                         <>
                            <div    title="accept request">
                                    <PlusIcon size={35} focusColor="green" fn={async()=>{
                                        await acceptReq(request.id)
                                        updateApp()
                                    }}/>
                            </div>
                            <div title="reject request">
                                    <BlockeIcon size={35} focusColor="red" fn={async()=>{
                                        await rejectReq(request.id)
                                        updateApp()
                                    }} />
                            </div>                         
                         </>   
                        )}

                    </div>
                    */}
                </div>
            )
        })
    }
    const acceptReq = async(id) =>{
        try{
            console.log('processing accept request')
            const response = await fetch('http://localhost:3000/friend/accept-request',{
                method: 'PUT',
                headers:{
                  "Content-Type": 'Application/json',
                  "Authorization": `Bearer ${auth.accessToken}`,
                },
                body: JSON.stringify({
                    requestId : id,
                })
            })
            await reAuth(response);
            const result = await response.json();
            console.log(result)
            if(!response.ok) throw new Error(`${result.msg}`)
        
            notify.success('friend added')
            updateApp()
        }catch(err){
            notify.error(err)
        }
    }
    const rejectReq = async(id) =>{
        try{
            console.log('processing reject request')
            const response = await fetch('http://localhost:3000/friend/reject-request',{
                method: 'DELETE',
                headers:{
                  "Content-Type": 'Application/json',
                  "Authorization": `Bearer ${auth.accessToken}`,
                },
                body: JSON.stringify({
                    requestId : id,
                })
            })
            await reAuth(response);
            const result = await response.json();
            if(!response.ok) throw new Error(`${result.msg}`)
        
            notify.warn('friend request rejected');
            updateApp()
        }catch(err){
            notify.error(err)
        }
    }
    
    useEffect(()=>{
        console.log(inbox)
        handleCurrentChannel(null)
        setInboxContent(inbox);
        
    },[])
    useEffect(()=>{
        console.log(inboxContent)
        setInboxContent(inbox);
    },[inboxContent])
    if(!inboxContent){
        return(
            <>
            Loading
            </>
        )
    }
    return(
        <div>
            <div className={style.main}>
                <div className={style.title}>
                    <h1>Inbox</h1><h4>{inboxContent.length}</h4>   
                </div>
                

                {inboxContent.length? (
                  <div className={style.content}>
                    {populateRequests(inboxContent)} 
                  </div>
                   
                ):(
                    <div className={style.content}>
                        <h2 style={{alignSelf: 'center', color: '#686868'}}>Empty</h2>                        
                    </div>

                )}
                <div>
                    
                </div>             
            </div>

        </div>
    )
}
export{
    Inbox
}