import style from './chatinterface.module.css'
import sendMsg from '../../../assets/icons/send.svg'
import { SendIcon } from '../../iconhelper/iconHelper'
import { redirect, useOutletContext } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { notify } from '../../norifications/notifications'
/*
required backend handelling functionality:-
* if outlet context user object and jwt token exists
-> required: handle reply to messages
-> required: rerender chat log on message changes
-> required: enable edit and delete message functions for message owners
-> required: enable delete message function for users who are mods(in that channel)
-> EXTRA: enable adding photos in the chat as messages or gifs and or emojies!
*/
const ChatInterface = ({needsUpdate, reply, cancleReply, editMode, resetEditor}) =>{
    const{callApi ,currentChannel} = useOutletContext();
    const [message, setMessage]= useState('')
    const sendMessage= async(message, parentId = null)=>{
        try{
            const response = await callApi({
                method:'POST',
                path: `channel/${currentChannel}/msgs`,
                requiresAuth: true,
                body:{
                    content: message,
                    parentId: parentId,
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
            setMessage('');
            return await response.json();
        }catch(err){
            notify.error(err.message)
            console.log(err)
        }
    }
    const editMessage = async(newMessage, id)=>{
        try{
            const response = await callApi({
                method:'PUT',
                path: `channel/${currentChannel}/msgs`,
                requiresAuth: true,
                body:{
                    content: message,
                    id: id,
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
            setMessage('')
            resetEditor()
            return await response.json();
        }catch(err){
            notify.error(err.message)
            console.log(err.message)
        }
    }
    useEffect(()=>{
        if(!editMode) return
        setMessage(editMode.message)
    },[editMode])
    return(
        <div className={style.chatInterface}>
            {/*handels reply messages*/}
            {reply?(
                <div className={style.replyIndecator}>
                    replying to {reply.name}
                    <button style={{marginLeft: 'auto'}}
                    type='button'
                    onClick={()=>{
                        if(!reply) return
                        cancleReply()
                    }}
                    >x</button>
                </div>
            ):('')}
 
            { editMode?(                
                <>
                    {/*handels editing mode*/}
                    <div className={style.replyIndecator}>
                        Edite mode
                        <button style={{marginLeft: 'auto'}}
                        type='button'
                        onClick={()=>{
                            if(!editMode) return
                            setMessage('')
                            resetEditor()
                        }}
                        >x</button>
                    </div>
                    <button htmlFor='message' className={`${style.msgButton} ${style.rightBtn}`}>+</button>
                    <div className={style.textWrapper}>
                        <textarea id='message' 
                            name='message' 
                            className={style.msgTxtArea} 
                            placeholder='message @Group'
                            value={message}
                                onChange={(e)=>
                                    setMessage(e.target.value)
                                }
                            >
                        </textarea>
                    </div>
                    <button htmlFor='message' 
                            className={`${style.msgButton} ${style.leftBtn}`}
                            onClick={ async()=> {
                                await editMessage(message, editMode.id) 
                                if(!reply) return
                                cancleReply();
                                
                            }}
                            >
                        {/*to change focuse color, open local css file*/}
                        <SendIcon color={'white'} 
                                size={24} />
                    </button>
                </>
            ):(
                <>
                    {/*handels send mode*/}
                    <button htmlFor='message' className={`${style.msgButton} ${style.rightBtn}`}>+</button>
                    <div className={style.textWrapper}>
                        <textarea id='message' 
                            name='message' 
                            className={style.msgTxtArea} 
                            placeholder='message @Group'
                            value={message}
                                onChange={(e)=>
                                    setMessage(e.target.value)
                                }
                            >
                        </textarea>
                    </div>
                    <button htmlFor='message' 
                            className={`${style.msgButton} ${style.leftBtn}`}
                            onClick={ async()=> {
                                await sendMessage(message, reply?.id) 
                                if(!reply) return
                                cancleReply();
                                
                            }}
                            >
                        {/*to change focuse color, open local css file*/}
                        <SendIcon color={'white'} 
                                size={24} />
                    </button>
                </>
            )}
        </div>
    )
}
export{
    ChatInterface
}