import { GroupIcon, UserIcon } from "../../iconhelper/iconHelper";
import style from './card.module.css';
import { useOutletContext, redirect } from "react-router-dom";

const Card = ({data, searchType})=>{
    const {auth, goTo} = useOutletContext();
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
                            <button>send request</button>
                            <button>visit profile</button>
                        </>
                    )}

                </div>
            
            </div>
        )        
    }else{
        //case where user looks up group- group must be of GROUP type
        if(data.type === 'FRIEND') return(
            <h2>Unauthorized</h2>
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