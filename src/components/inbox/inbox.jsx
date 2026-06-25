import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom"
import { BlockeIcon, PlusIcon, UserIcon } from "../iconhelper/iconHelper";
import style from './inbox.module.css';
import { notify } from "../norifications/notifications";
const Inbox = () =>{
    const{auth, reAuth,inbox, handleCurrentChannel} = useOutletContext();
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
                    <h2>{request.friend.name}</h2>
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
        
            notify.warn('friend request rejected')
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
    },[inboxContent])
    if(!inbox){
        return(
            <>
                <h1>Inbox is Empty</h1>
            </>
        )
    }
    return(
        <div>
            <div>
                <h1>Incoming</h1>
                <div>
                    {populateRequests(inboxContent)}
                </div>
                <h1>Outgoing</h1>                
            </div>
            <div>
                requests go here
            </div>

        </div>
    )
}
export{
    Inbox
}