import { ReplyIcon, UserIcon } from '../../iconhelper/iconHelper'
import style from './chatlog.module.css'

const ChatLog=({messages, users})=>{
    //gets pure user data
    const userData = users.map(connection =>{
        return{
            id: connection.user.id,
            name: connection.user.name,
            photo: connection.user.photo
        }
    })
    const populateChat =(messages)=>{
        return messages.map( msg=>{

            return msg.parent? (
                <div key={msg.id} className={style.msgCardReply}>       
                    <div key={msg.parent.id} className={style.replyMsg}>
                        reply to:
                        <div style={{display: 'inline',color: '#e35b5b'}}> 
                            @{msg.parent.user.name}
                        </div>
                        <p className={style.replyText}>{msg.parent.content}</p>

                    </div>
                    <div className={style.msgSuthor}>      
                        <UserIcon   size={30}
                                    color={'#27282c'} 
                                    focusColor={'#62646b'}/> @{msg.user.name}
                    
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
                                    <p className={style.authorname}>@{msg.user.name}</p>
                    </div>
                    <div className={style.msgTxt}>{msg.content}</div>
                    <div className={style.msgDate}>{msg.createdAt}</div>
                </div> 
            )                   
        })
    }
    if(messages.length <= 0){
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
