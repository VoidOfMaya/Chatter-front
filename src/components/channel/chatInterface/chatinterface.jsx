import style from './chatinterface.module.css'
import sendMsg from '../../../assets/icons/send.svg'
import { SendIcon } from '../../iconhelper/iconHelper'
import { redirect, useOutletContext } from 'react-router-dom'
import { useState } from 'react'
import { notify } from '../../norifications/notifications'
/*
required backend handelling functionality:-
* if outlet context user object and jwt token exists
-> on message button click it takes user object and
    chat object then uploads message with user id and channel id
    * always checks for if message is a reply to an other message
      in that case it will also attach the messages id
-> EXTRA: enable adding photos in the chat as messages or gifs and or emojies!
*/
const ChatInterface = () =>{
    const{auth, reAuth,currentChannel, getChatlog, goTo} = useOutletContext();
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
            return await result.json();
        }catch(err){
            notify.error(err.message)
            console.log(err)
        }
    }
    return(
        <div className={style.chatInterface}>
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
                        await getChatlog(currentChannel)
                        
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