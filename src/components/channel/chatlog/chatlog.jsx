import { useOutletContext } from 'react-router-dom'
import {DeletetIcon, EditMessage, ReplyTo, ShieldIcon, UserIcon } from '../../iconhelper/iconHelper'
import style from './chatlog.module.css'
import { useRef, useEffect } from 'react'
import { notify

 } from '../../norifications/notifications'
const ChatLog=({messages, handleReply, isMod, needsUpdate, handleEditing})=>{
    const {auth,callApi, currentChannel, handleCurrentChannel} = useOutletContext();


    const chatRef = useRef(null);
    const deleteMessage = async (id) =>{
        try{
            const response = await callApi({
                method: 'DELETE',
                path:`channel/${currentChannel}/msgs`,
                requiresAuth: true,
                body:{
                    id:id
                }
            })
            if(!response.ok){

                const errBody = await response.json();
                if(Array.isArray(errBody.errors)){
                    errBody.errors.map(error =>{ 
                        notify.error(error.msg)
                    })
                }
                throw new Error (`${errBody.msg}`)
            }
            needsUpdate(true)
            return await response.json();
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
                        {/*MOD only privillage*/}
                        {isMod?(
                            <ShieldIcon size={25} focusColor='#f34900'></ShieldIcon>
                        ):('')}
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
                        {isMod?(
                            <ShieldIcon size={25} focusColor='#f34900'></ShieldIcon>
                        ):('')}
                    </div>
                    <div className={style.msgTxt}>{msg.content}</div>
                    <div className={style.msgDate}>{msg.createdAt}</div>
                </div> 
            )                   
        })
    }

    useEffect(()=>{
        chatRef.current?.scrollTo({
            top:chatRef.current.scrollHeight,
            behavior: 'smooth'
        })
    },[messages])
    if (!auth?.user) return null;
    if(!messages){
        notify.error('Could not access chaannel')
        handleCurrentChannel(1)
        return
    }
    if(messages.length <= 0 || !messages){
        return(
        <p>No messages found,Be the first to send a message!</p>
        )
    }
    return(
        <div ref={chatRef} className={style.ChatLog}>
        {populateChat(messages)}
        </div>
    )
}
export{
    ChatLog
}
