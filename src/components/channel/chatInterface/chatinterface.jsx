import style from './chatinterface.module.css'
import sendMsg from '../../../assets/icons/send.svg'
import { SendIcon } from '../../iconhelper/iconHelper'
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
    return(
        <div className={style.chatInterface}>
            <button htmlFor='message' className={`${style.msgButton} ${style.rightBtn}`}>+</button>
            <div className={style.textWrapper}>
                <textarea id='message' name='message' className={style.msgTxtArea} placeholder='message @Group'>
                </textarea>
            </div>
            <button htmlFor='message' className={`${style.msgButton} ${style.leftBtn}`}>
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