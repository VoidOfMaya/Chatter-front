import { useOutletContext } from 'react-router-dom'
import {DeletetIcon, EditMessage, ReplyTo, UserIcon } from '../../iconhelper/iconHelper'
import style from './chatlog.module.css'
import { useRef, useEffect } from 'react'
import { notify

 } from '../../norifications/notifications'
const ChatLog=({messages, handleReply, isMod, needsUpdate, handleEditing})=>{
    const {auth, reAuth, currentChannel} = useOutletContext();


    const chatRef = useRef(null);
    const deleteMessage = async (id) =>{
        console.log(`start delete`)
        try{
            const result = await fetch(`http://localhost:3000/channel/${currentChannel}/msgs`,{
                method: "DELETE",
                body: JSON.stringify({
                    id: id,
                }),
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Bearer ${auth.accessToken}`,
                },
            })
            reAuth(result)
            if(!result.ok){

                const errBody = await result.json();
                if(Array.isArray(errBody.errors)){
                    errBody.errors.map(error =>{ 
                        notify.error(error.msg)
                    })
                }
                console.log(errBody)
                throw new Error (`${errBody.msg}`)
            }
            needsUpdate(true)
            console.log(`delete successful`)
            return await result.json();
        }catch(err){
            notify.error(err.message)
            console.log(err)
        }
    }
    const populateChat =(messages)=>{
        return messages.map( msg=>{
            return msg.parent? (
                <div key={msg.id} className={style.msgCardReply}>
                    <div className={style.options}>
                        <ReplyTo size={25} focusColor='#f34900' fn={()=>{
                            handleReply({id: msg.id, name: msg.user.name})
                        }}/>
                        {/*Author only privilage*/}
                        {msg.user.id === auth.user.id?(
                            <EditMessage size={25} focusColor='#f34900' fn={()=> handleEditing(msg.id, msg.content)} />                            
                        ):('')}
                        {/*Author and Mod only privilage*/}
                        {msg.user.id === auth.user.id || isMod?
                        (
                            <DeletetIcon size={25} focusColor='#f34900' fn={ async()=>{
                                if(!window.confirm('Delete this message?')) return;
                                await deleteMessage(msg.id)

                            }}/>
                        ):('')
                        }

                    </div>       
                    <div key={msg.parent.id} className={style.replyMsg}>
                        reply to: 
                            <p 
                                style={ 
                                    msg.parent.user.id === auth.user.id?
                                    {
                                        color: '#487cff',
                                        display: 'inline'
                                    }:{
                                        color: '#ff5656',
                                        display: 'inline'
                                    }
                                }
                                >
                                 @{msg.parent.user.name}
                            </p>
                        <p className={style.replyText}>{msg.parent.content}</p>

                    </div>
                    <div className={style.msgSuthor}>      
                        <UserIcon   size={30}
                                    color={'#27282c'} 
                                    focusColor={'#62646b'}/> 
                                    <p style={msg.user.id === auth.user.id?{color: '#4774e4'}:{} }>
                                        @{msg.user.name}
                                    </p>
                    
                    </div>
                    <div className={style.msgTxt}>{msg.content}</div>
                    <div className={style.msgDate}>{msg.createdAt}</div>
                </div>
            ):(
                <div key={msg.id} className={style.msgCard}>
                    <div className={style.msgSuthor}>
                        <UserIcon   size={30}
                                    color={'#27282c'} 
                                    focusColor={'#62646b'}/>
                                    <p className={style.authorname}
                                       style={msg.user.id === auth.user.id?{color: '#4774e4'}:{} }>
                                        @{msg.user.name}
                                    </p>
                    </div>
                    <div className={style.options}>
                        <ReplyTo size={25} focusColor='#f34900' fn={()=>{
                            handleReply({id: msg.id, name: msg.user.name})
                        }}/>
                        {/*Author only privilage*/}
                        {msg.user.id === auth.user.id?(
                        <EditMessage size={25} focusColor='#f34900' fn={()=> handleEditing(msg.id, msg.content)}/>                            
                        ):('')}
                        {/*Author and Mod only privilage*/}
                        {msg.user.id === auth.user.id || isMod?
                        (
                            <DeletetIcon size={25} focusColor='#f34900'fn={ async()=>{
                                if(!window.confirm('Delete this message?')) return;
                                await deleteMessage(msg.id)

                            }}/>
                        ):('')
                        }
                    </div>
                    <div className={style.msgTxt}>{msg.content}</div>
                    <div className={style.msgDate}>{msg.createdAt}</div>
                </div> 
            )                   
        })
    }
    if(messages.length <= 0 || !messages){
        return(
        <p>No messages found,Be the first to send a message!</p>
        )
    }
    useEffect(()=>{
        chatRef.current?.scrollTo({
            top:chatRef.current.scrollHeight,
            behavior: 'smooth'
        })
    },[messages])
    return(
        <div ref={chatRef} className={style.ChatLog}>
        {populateChat(messages)}
        </div>
    )
}
export{
    ChatLog
}
