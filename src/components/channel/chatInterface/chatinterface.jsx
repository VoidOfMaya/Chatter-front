import style from './chatinterface.module.css'
import sendMsg from '../../../assets/icons/send.svg'
import { SendIcon } from '../../iconhelper/iconHelper'
import { redirect, useOutletContext } from 'react-router-dom'
import { useState } from 'react'
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
const ChatInterface = ({needsUpdate, reply, cancleReply}) =>{
    const{auth, reAuth,currentChannel} = useOutletContext();
    const [message, setMessage]= useState({txt:'', parentId: null})
    const sendMessage= async(message, parentId = null)=>{
        try{
            console.log(`message to send: ${message}, is response to ${parentId}`)
            const result = await fetch(`http://localhost:3000/channel/${currentChannel}/msgs`,{
                method: "POST",
                body: JSON.stringify({
                    content: message,
                    parentId: parentId,
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
            return await result.json();
        }catch(err){
            notify.error(err.message)
            console.log(err)
        }
    }
    return(
        <div className={style.chatInterface}>
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
            <button htmlFor='message' className={`${style.msgButton} ${style.rightBtn}`}>+</button>
            <div className={style.textWrapper}>
                <textarea id='message' 
                    name='message' 
                    className={style.msgTxtArea} 
                    placeholder='message @Group'
                    value={message.txt}
                        onChange={(e)=>
                            setMessage((prev)=>({
                                ...prev, 
                                txt: e.target.value,
                            }))
                        }
                    >
                </textarea>
            </div>
            <button htmlFor='message' 
                    className={`${style.msgButton} ${style.leftBtn}`}
                    onClick={ async()=> {
                        await sendMessage(message.txt, message.parentId)     
                    }}
                    >
                {/*to change focuse color, open local css file*/}
                <SendIcon color={'white'} 
                         size={24} />
            </button>
        </div>
    )
}
export{
    ChatInterface
}