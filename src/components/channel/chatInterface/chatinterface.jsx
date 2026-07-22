import style from './chatinterface.module.css'
import { SendIcon } from '../../iconhelper/iconHelper'
import { useOutletContext } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { MsgPhoto } from '../../dialogs/dialogs'
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
const ChatInterface = ({
    needsUpdate, 
    emitEvent,
    reply, 
    cancleReply, 
    editMode, 
    resetEditor,
    message,
    handleMessage,

}) =>{
    const{callApi ,currentChannel} = useOutletContext();
    //const [message, setMessage]= useState('')
    const photoRef = useRef(null)
    const [photoDialog, setPhotoDialog] = useState(false)
    const [photoData, setPhotoData] = useState(null)
    const [previewUrl, setPreviewUrl]= useState(null)

    const getFileData = (data, previewUrl)=>{
        setPhotoData(data)
        setPreviewUrl(previewUrl)
    }
    const sendMessage= async(message, parentId = null,photoFile = null)=>{
        try{
            const formData = new FormData()
            formData.append('content', message);
            if(parentId)formData.append('parentId', parentId);
            if(photoFile)formData.append("file", photoFile);
            
            const response = await callApi({
                method:'POST',
                path: `channel/${currentChannel}/msgs`,
                requiresAuth: true,
                body:formData
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
            needsUpdate(true);
            emitEvent(true);
            handleMessage('');
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
            needsUpdate(true);
            emitEvent(true);
            handleMessage('');
            resetEditor()
            return await response.json();
        }catch(err){
            notify.error(err.message)
            console.log(err.message)
        }
    }
    useEffect(()=>{
        if(!editMode) return
        handleMessage(editMode.message)
    },[editMode])
    return(
        <div className={style.chatInterface}>
            {photoData&& (
                <div className={style.photoPreview}>
                    <img src={previewUrl}
                        style={{borderRadius: '15px 0px 0px 15px'}}
                        width='50px'
                        height='50px'/>
                    <p style={{fontSize: '14px',width: 'fit-content'}}>Preview</p>
                    <button 
                        style={{width: 'fit-content'}} 
                        type='button'
                        onClick={()=>{
                                setPhotoData(null)
                                setPreviewUrl(null)
                        }}>X</button>
                </div>                
            )}

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
                            handleMessage('')
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
                                    handleMessage(e.target.value)
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
                    <button htmlFor='message' 
                    className={`${style.msgButton} ${style.rightBtn}`}
                    onClick={()=>setPhotoDialog(true)}>
                        +
                    </button>
                    <div className={style.textWrapper}>
                        <textarea id='message' 
                            name='message' 
                            className={style.msgTxtArea} 
                            placeholder='message @Group'
                            value={message}
                                onChange={(e)=>
                                    handleMessage(e.target.value)
                                }
                            >
                        </textarea>
                    </div>
                    <button htmlFor='message' 
                            className={`${style.msgButton} ${style.leftBtn}`}
                            onClick={ async()=> {
                                await sendMessage(message, reply?.id,photoData) 
                                if(!reply) return
                                cancleReply();
                                setPhotoData(null)
                                
                            }}
                            >
                        {/*to change focuse color, open local css file*/}
                        <SendIcon color={'white'} 
                                size={24} />
                    </button>
                </>
            )}
            {photoDialog && (
                <div style={{position: 'absolute',top: '-80px',left:'50px'}}>
                    <MsgPhoto 
                    referance={photoRef} 
                    close={()=>setPhotoDialog(false)}
                    setPhotoData ={getFileData}
                    />                            
                </div >
            )}
        </div>
    )
}
export{
    ChatInterface
}