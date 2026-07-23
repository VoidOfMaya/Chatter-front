import { GroupIcon, UserIcon } from "../../iconhelper/iconHelper";
import style from './card.module.css';
import { useOutletContext} from "react-router-dom";
import { notify } from "../../norifications/notifications";

const Card = ({data, searchType})=>{
    const {auth, callApi, goTo,updateApp,handleCurrentChannel,chnls} = useOutletContext();
    const sendFriendRequest = async(id) =>{
        try{
            const response = await callApi({
                method:'POST',
                path:`friend/send-request`,
                requiresAuth: true,
                body:{ recieverId: id}
            })
            if(!response.ok){
                throw new Error(`${response.status}`)
            }
            const result = await response.json()
            notify.success("request sent")
            updateApp()          
        }catch(err){
            console.log(err.message)
            notify.warn(err.message)
        }
    };
    const sendGroupJoinRequest = async(id)=>{
        try{
            const response = await callApi({
                method:'POST',
                path: `channel/${id}/joinReq`,
                requiresAuth: true,
            })
            if(!response.ok){
                throw new Error(`${response.status}`)
            }
            const result = await response.json()
            notify.success("request sent")
            updateApp();            
        }catch(err){
            console.log(err.message)
            notify.warn(err.message)
        }

        
    };
    //checks if connections already exist
    const friendExists = chnls.friends.find(friends=>{
        return friends.id === data.id
    })
    const groupExists = chnls.channels.find(channel=>{
        return channel.id === data.id
    })
    if(searchType){
        // case where user searches other users
        return(
            <div className={style.mainContainer}>
                <h2 style={{color: '#4d4c4c'}}>#{data.id}</h2>
                <div >
                    {data.photo? (
                        <img alt="user profile photo" src={`${data.photo}`}/>
                    ):(
                        <UserIcon size={45} />
                    )}
                </div>
                <h3>{data.name}</h3>
                <div className={style.options}>
                    {/*checks if user is current user or friendship exists*/}
                    {auth.user.id === data.id || friendExists?(
                        <button
                        type="button"
                        onClick={()=>{
                            goTo('/profile/me')
                        }}
                        >Go to Profile</button>
                    ):(
                        <>
                            <button
                                onClick={()=>{
                                    sendFriendRequest(data.id)
                                }}>add friend</button>
                            <button>visit profile</button>
                        </>
                    )}

                </div>
            
            </div>
        )        
    }else{
        //case where user looks up group- group must be of GROUP type
        if(data.type === 'FRIEND'|| data.email) return(
            <h2>no results found</h2>
        )
         //check if group already exists in dashboard

        return(
            <div className={style.mainContainer}>
                <h2 style={{color: '#4d4c4c'}}>#{data.id}</h2>
                <GroupIcon size={45} />
                <h3>{data.name}</h3>
                <div className={style.options}>
                    {groupExists? (
                    <button
                    onClick={()=>{
                      handleCurrentChannel(data.id) 
                      goTo('/chatter')
                    }}
                    >go to channel</button>                        
                    ):(
                        <button
                        onClick={()=>{
                            sendGroupJoinRequest(data.id)
                        }}>join group</button>                        
                    )}


                </div>
            
            </div>
        )
    }

}

export{
    Card
}