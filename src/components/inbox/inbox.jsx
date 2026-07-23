import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom"
import { BlockeIcon, PlusIcon, UserIcon } from "../iconhelper/iconHelper";
import style from './inbox.module.css';
import { notify } from "../norifications/notifications";
const Inbox = () =>{
    const{auth, callApi,inbox, handleCurrentChannel,updateApp} = useOutletContext();
    const populateRequests = (requestArray) =>{
        if (!requestArray)return
        return requestArray.map((request)=>{
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
                    ):(
                        //where user is the recipient
                        <>
                            <h2>{request.user.name}</h2>
                            <div className={style.options}>
                                <h3 style={{color: '#686868'}}>{request.status}</h3>
                            </div>
                        </>
                    )}
                </div>
            )
        })
    }
    const acceptReq = async(id) =>{
        try{
            const response = await callApi({
                method: 'PUT',
                path:`friend/accept-request`,
                requiresAuth: true,
                body:{requestId: id}
            })
            const result = await response.json();
            if(!response.ok) throw new Error(`${result.msg}`)
            notify.success('friend added')
            updateApp()
        }catch(err){
            notify.error(err.message)
            console.log(err.message)
        }
    }
    const rejectReq = async(id) =>{
        try{
            const response = await callApi({
                method:'DELETE',
                path:'friend/reject-request',
                requiresAuth: true,
                body: {requestId: id}
            })
            const result = await response.json();
            if(!response.ok) throw new Error(`${result.msg}`)
        
            notify.warn('friend request rejected');
            updateApp()
        }catch(err){
            notify.error(err.message)
            console.log(err.message)
        }
    }
    
    useEffect(()=>{
        handleCurrentChannel(null)
    },[])
    if(!inbox){
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
                    <h1>Inbox</h1><h4>{inbox.length}</h4>   
                </div>
                

                {inbox.length? (
                  <div className={style.content}>
                    {populateRequests(inbox)} 
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