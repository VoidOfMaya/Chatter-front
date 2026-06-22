import { GroupIcon, UserIcon } from "../../iconhelper/iconHelper";
import style from './card.module.css';
import { useOutletContext} from "react-router-dom";
import { notify } from "../../norifications/notifications";

const Card = ({data, searchType})=>{
    const {auth, reAuth, goTo} = useOutletContext();
    const sendFriendRequest = async(id) =>{
        try{
            const response = await fetch(`http://localhost:3000/friend/send-request`,{
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${auth.accessToken}`,
                    },
                    body: JSON.stringify({
                        recieverId:Number(id)
                    }),
                })
            reAuth(response);
            if(!response.ok){
                throw new Error(`${response.status}`)
            }
            const result = await response.json()
            notify.success("request sent")
            return result            
        }catch(err){
            console.log(err.message)
            notify.warn(err.message)
        }

        
    };
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
                    {auth.user.id === data.id?(
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
                                }}>send request</button>
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
        return(
            <div className={style.mainContainer}>
                <h2 style={{color: '#4d4c4c'}}>#{data.id}</h2>
                <GroupIcon size={45} />
                <h3>{data.name}</h3>
                <div className={style.options}>
                    <button>send request</button>
                    <button>visit profile</button>
                </div>
            
            </div>
        )
    }

}

export{
    Card
}