    
import { useNavigate, useParams } from "react-router-dom"
import { BlockeIcon, EditeProfile, PlusIcon, UserIcon } from "../iconhelper/iconHelper";
import style from './profile.module.css';
import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { notify } from "../norifications/notifications";
import { UploadPhoto } from "../dialogs/dialogs";
const Profile = () =>{
/*
user data:{id, email, name, bio, photo, is_online, last_login, created_at}
*/
    const {auth, callApi, chnls,handleCurrentChannel,goTo, updateApp}= useOutletContext();
    const redirect = useNavigate();
    const{profileId}= useParams();
    const [user, setUser] = useState({       
        name: '',
        bio: '',
        photo: '',
        email: '',
        createdAt:'',
    });
    const [metadata, setMetadata]= useState(null);
    const [formData, setFormData] = useState({
        name: user.name,
        bio: user.bio,
        photo: user.photo
    })    
    const [isFriend, setIsFriend] = useState(false)
    const [editMode, setEditMode] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [onlineStatus, setOnlineStatus] = useState(null);

    const [photo, setPhoto] = useState(false)
    const photoDialog =useRef(null)
    const [photoData, setPhotoData] = useState(null)
    const [previewUrl, setPreviewUrl]= useState(null)

    const getFileData = (data, previewUrl)=>{
        setPhotoData(data)
        setPreviewUrl(previewUrl)
    }

    const photoLogo = () =>{
        return(
            <>{editMode? (
                <>
                <div style={{position: 'relative'}}>
                    {(user.photo || previewUrl)? (
                        <img src={user.photo || previewUrl} 
                            width='100px'
                            height='100px'
                            className={`${style.pfp} ${onlineStatus? style.isOnline : style.isOffline } `}
                        />
                    ):(
                        <UserIcon size={100} focusColor="#27282c" />
                    )}  
                    <div style={
                        {
                            position: 'absolute',
                            bottom: '10px', 
                            right: '0px',
                            cursor: 'pointer'
                        }
                        }>
                        <PlusIcon size={30} color="#fff" focusColor="#E84545"
                            fn={()=>{
                                setPhoto(true)
                                //photoDialog.current.show()
                            }}/>                 

                    </div>                    
                </div>
                </>
                ):(
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
                    created at:<div className={style.dataTxt}>{user.createdAt}</div>  
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
            const updatedData = new FormData()
            if(formData.name)updatedData.append('name', formData.name);
            if(formData.bio)updatedData.append('bio', formData.bio);
            if(photoData)updatedData.append('file', photoData);  
            const response = await callApi({
                method:'PUT',
                path:'user/me/profile',
                requiresAuth: true,
                body:updatedData
            })
            if(!response.ok){
                const errBody = await response.json();
                if(Array.isArray(errBody.errors)){
                    errBody.errors.map(error =>{
                        notify.error(error.msg)
                    })
                }
                throw new Error (`something went wrong`)
            }
            const newData = await response.json();
            setUser(prev =>({
                    ...prev,
                    name: newData.name,
                    bio:newData.bio,
                    photo:newData.photo,
                })
            )
            
            setEditMode(false);
            updateApp();
        }catch(err){
            notify.error(err.message)
            console.log(err.message)
        }
    }
    const getProfileData = async () =>{
        setLoadingData(true)
        if(!profileId) return notify.error('No profile found!')
        if(profileId === 'me'){
            try{
                const response =await callApi({
                    method: 'GET',
                    path:`user/me/profile`,
                    requiresAuth: true,
                })
                return await response.json()
            }catch(err){
                console.log(err.message)
                notify.error(err.message)
            }  
        }else{
            try{
                const response = await callApi({
                    method: 'GET',
                    path:`user/${profileId}`,
                    requiresAuth: true,
                })
                return await response.json()

            }catch(err){
                console.log(err.message)
                notify.error(err.message)
            }  
        }

    }
    //teminate friendship
    const deleteFriend =  async(connectionId, channelId) =>{
        if(!isFriend) return
        try{
            const response = await callApi({
                method: 'DELETE',
                path:`friend/`,
                requiresAuth: true,
                body:{
                    relationId: connectionId,
                    channelId: channelId,
                }
            })
            if(!response.ok){
                throw new Error(`${response.status}`)
            }
            const result = await response.json()
            notify.success("request sent")
            updateApp()          
            setIsFriend(false)
        }catch(err){
            console.log(err.message)
            notify.warn(err.message)
        }

        
    }
    useEffect(()=>{
        if (!auth.user) return redirect('/');
        const loadProfile = async() =>{
            setLoadingData(true)
            try{
                if(!profileId=== 'me'){
                    const relation = chnls.friends.find(friend =>{
                        return friend.id === profileData.id
                    })
                    if(!relation) throw new Error('relation was not found')
                    setMetadata({connectionId: relation.connectionId,channelId:relation.channelId})
                }
                const profileData = await getProfileData();
                setUser(
                    {   name: profileData.name,
                        bio: profileData.bio,
                        photo: profileData.photo,
                        email: profileData.email,
                        createdAt: profileData.createdAt
                    }
                );
                setOnlineStatus(user.is_online);
                setLoadingData(false)                
            }catch(err){
                notify.error(err)
            }

        }
        const handleFriend = () =>{
            const result = chnls.friends.some(friend =>{
                 return friend.id === Number(profileId)
                })
            setIsFriend(result)
        }

        loadProfile()
        handleFriend()
    },[])
    useEffect(()=>{
        if(profileId){
            handleCurrentChannel(null)
        }
    },[profileId])
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
                {photo && (
                    <>
                        <UploadPhoto 
                        referance={photoDialog} 
                        close={()=>setPhoto(false)}
                        setPhotoData ={getFileData}/>                            
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
                    {isFriend? (
                        <div className={style.blockIcon} title="terminate friendship">
                            <BlockeIcon size={35} color="#5a5a5a" focusColor="#ff0c0c"
                                fn={async()=>{
                                    const confirm = window.confirm('the following action will delete both your connection and conversation with this person!')
                                    if(!confirm) return;
                                    await deleteFriend(metadata.connectionId, metadata.channelId )
                                }} />    
                        </div>
                        ):(
                        '')}
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