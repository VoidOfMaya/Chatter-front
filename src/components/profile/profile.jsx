import { useNavigate, useParams } from "react-router-dom"
import { UserIcon } from "../iconhelper/iconHelper";
import style from './profile.module.css';
import { user as userData } from '../../mock/data'
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
const Profile = () =>{
/*
user data:{id, email, name, bio, photo, is_online, last_login, created_at}
*/
    const {auth}= useOutletContext();
    const redirect = useNavigate();
    const{profileId}= useParams();
    const [user, setUser] = useState(userData);
    const [onlineStatus, setOnlineStatus] = useState(null);

    useEffect(()=>{
       setOnlineStatus(user.is_online) 
    },[])
    const photoLogo = () =>{
        return(
            <>
                {(user.photo)? (
                    <img src={user.photo} 
                         width='100px'
                         height='100px'
                         className={`${style.pfp} ${onlineStatus? style.isOnline : style.isOffline } `}
                    />
                ):(
                    <UserIcon size={100}/>
                )}            
            </>

        )
    }
    useEffect(()=>{
        if (!auth) return redirect('/')
        setUser(userData)
    },[])
    return(
        <> 
            <main className={style.main}> 
                <div className={style.profile}>
                    <div style={{display: 'flex', padding: '10px'}}>
                        {photoLogo()}
                        <div style={{padding: '10px'}} >bio: <p className={style.dataTxt}>{user.bio}</p></div>
                    </div>
                    <div className={style.profileData}>
                        user:<div className={style.dataTxt}>{user.email}</div>
                        name:<div className={style.dataTxt}>{user.name}</div>
                       
                        created at:<div className={style.dataTxt}>{user.created_at}</div>                        
                    </div>

                </div>
            </main>
        </>
    )
}
export{
    Profile
}