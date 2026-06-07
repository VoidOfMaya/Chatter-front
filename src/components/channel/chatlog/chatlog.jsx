import { useOutletContext } from 'react-router-dom'
import { ReplyIcon, UserIcon } from '../../iconhelper/iconHelper'
import style from './chatlog.module.css'

const ChatLog=({messages})=>{
    const {auth} = useOutletContext()
    const populateChat =(messages)=>{
        return messages.map( msg=>{

            return msg.parent? (
                <div key={msg.id} className={style.msgCardReply}>       
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
    return(
        <>
        {populateChat(messages)}
        </>
    )
}
export{
    ChatLog
}
