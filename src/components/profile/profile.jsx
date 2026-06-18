    
import { useNavigate, useParams } from "react-router-dom"
import { EditeProfile, UserIcon } from "../iconhelper/iconHelper";
import style from './profile.module.css';
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { notify } from "../norifications/notifications";
const Profile = () =>{
/*
user data:{id, email, name, bio, photo, is_online, last_login, created_at}
*/
    const {auth, reAuth,currentChannel,handleCurrentChannel,goTo}= useOutletContext();
    const redirect = useNavigate();
    const{profileId}= useParams();
    const [user, setUser] = useState({       
        name: '',
        bio: '',
        photo: ''
    });
    const [formData, setFormData] = useState({
        name: user.name,
        bio: user.bio,
        photo: user.photo
    })    

    const [editMode, setEditMode] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [onlineStatus, setOnlineStatus] = useState(null);


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
    const editProfile = ()=>{
        return(
            <>
            <form className={style.profile}
                onSubmit={(e)=> e.preventDefault()}>
                <div style={{display: 'flex', padding: '10px'}}>
                    {photoLogo()}
                    <label style={{padding: '10px'}}>bio:</label>
                    <textarea  
                        maxLength={250}
                        className={`${style.dataTxt} ${style.bioInput}`}
                        value={formData.bio}
                        onChange={(e)=>{
                            setFormData({...formData, bio: e.target.value})
                            }
                        } 
                    ></textarea>                                    
                </div>
                <div className={style.profileData}>
                    user:<div className={style.dataTxt}>{user.email}</div>
                    <label>username:</label>
                    <input 
                        className={style.dataTxt}
                        value={formData.name}
                        onChange={(e)=>{
                            setFormData({...formData, name: e.target.value})
                            }
                        }>        
                    </input>
                    created at:<div className={style.dataTxt}>{user.created_at}</div>  
                </div>
                <div style={{display: 'flex', width: '100%'}}>
                    <button 
                        type="submit"
                        style={{flex: '1'}}
                        onClick={async()=>await submitProfileInfo()}>save change</button>
                    <button
                        type="button" 
                        style={{flex: '1'}}
                        onClick={()=>{    
                            setFormData({
                                name: user.name,
                                bio: user.bio,
                                photo: user.photo
                            })
                            setEditMode(false)
                        }}>discard changes</button>                                
                </div>
            </form>
            </>
        )
    }
    const submitProfileInfo = async ()=>{
        try{
            const result = await fetch(`http://localhost:3000/user/me/profile`,{
                method: "PUT",
                body: JSON.stringify({
                    name: formData.name,
                    bio: formData.bio,
                    photo: formData.photo
                }),
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Bearer ${auth.accessToken}`,
                },
            })
            if(!result.ok){
                const errBody = await result.json();
                if(Array.isArray(errBody.errors)){
                    errBody.errors.map(error =>{
                        notify.error(error.msg)
                    })
                }
                throw new Error (`something went wrong`)
            }
            const newData = await result.json();
            setUser(prev =>({
                    ...prev,
                    name: newData.name,
                    bio:newData.bio,
                    photo:newData.photo,
                })
            )
            setEditMode(false);
        }catch(err){
            console.log(err.message)
        }
    }
    const getProfileData = async () =>{
        setLoadingData(true)
        if(!profileId) return notify.error('No profile found!')
        if(profileId === 'me'){
            try{
                const response = await fetch('http://localhost:3000/user/me/profile',{
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${auth.accessToken}`,
                    },
                })
                reAuth(response);
                return await response.json()

            }catch(err){
                console.log(err.message)
                notify.error(err.message)
            }  
        }else{
            try{
                const response = await fetch(`http://localhost:3000/user/${profileId}`,{
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${auth.accessToken}`,
                    },
                })
                reAuth(response);
                return await response.json()

            }catch(err){
                console.log(err.message)
                notify.error(err.message)
            }  
        }

    }
    useEffect(()=>{
        if(profileId){
            console.log(`user profile detected`)
            handleCurrentChannel(null)
        }
    },[profileId])
    useEffect(()=>{
        if (!auth) return redirect('/');
        console.log(currentChannel)
        const loadProfile = async() =>{
            setLoadingData(true)
            const profileData = await getProfileData();
            setUser(profileData);
            setOnlineStatus(user.is_online);
            setLoadingData(false)
        }

        loadProfile()
    },[])
    if(loadingData){
        return(<div>Loading ....</div>)
    }
    //handels current user profile:
    if(!profileId){
        notify.error('Something went wrong,can not view profile')
        goTo('/chatter')
    }
    if(profileId === 'me'){
        return(
            <> 
            <main className={style.main}> 
                    {editMode? (
                        <>{editProfile()}</>
                    ):(
                        <>
                        <div className={style.profile}>
                                <div className={style.editICon}
                                    onClick={()=> {
                                            setFormData({
                                                name: user.name,
                                                bio: user.bio,
                                                photo: user.photo
                                            });
                                        setEditMode(true)
                                        }
                                    }>
                                    <EditeProfile size={35} color="#5a5a5a" focusColor="#ffffff" />                    
                                </div>
                                <div style={{display: 'flex', padding: '10px'}}>
                                    {photoLogo()}
                                    <div style={{padding: '10px'}} >
                                        <p className={style.dataTxt}> {user.bio}</p>
                                    </div>
                                </div>
                                <div className={style.profileData}>
                                    user:<div className={style.dataTxt}>{user.email}</div>
                                    name:<div className={style.dataTxt}>{user.name}</div>
                                
                                    created at:<div className={style.dataTxt}>{user.createdAt}</div>                        
                                </div>
                        </div>
                        </>
                    )}
            </main>
            </>
        )
    }else{
        return(
            <> 
            <main className={style.main}> 
                <div className={style.profile}>
                        <div style={{display: 'flex', padding: '10px'}}>
                            {photoLogo()}
                            <div style={{padding: '10px'}} >
                                <p className={style.dataTxt}> {!user.bio?('no bio yet'):(user.bio)}</p>
                            </div>
                        </div>
                        <div className={style.profileData}>
                            user:<div className={style.dataTxt}>{user.email}</div>
                            name:<div className={style.dataTxt}>{user.name}</div>          
                            created at:<div className={style.dataTxt}>{user.createdAt}</div>                        
                        </div>
                </div>
            </main>
            </>
        )   
    }

}
export{
    Profile
}