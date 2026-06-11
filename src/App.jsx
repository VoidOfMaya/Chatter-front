import { useEffect, useState} from 'react'
import style from './App.module.css'
import { Outlet ,useNavigate } from 'react-router-dom'
import { SideBar } from './components/sidebar/sidebar';
import { MembersBar } from './components/members/members';
import {ToastContainer, Bounce} from 'react-toastify'
import { notify } from './components/norifications/notifications';

function App() {
  //authentication state
  const [auth, setAuth]= useState(null);//holds user auth data and tokens
  
  //component hide/show state:-
  const [channelView,setChannelView]=useState(true)//sidebar channel list display toggle
  const [viewMembers,setViewMembers]=useState(false)//members list display toggle  
  
  //dashboard data states:-
  const [chnls, setChnls] = useState(null);//holds channel data user has
  const [members, setMembers] = useState(null);//list of channel members per channel
  
  //current Channel state:-
  const [currentChannel, setCurrentChannel]= useState(1)
  const [channelData, setChannelData] = useState(null) ;

  // temporary loading states :-
  const [chatLoader, setChatLoader] = useState(true);
  const [authLoading, setLoadingAuth] = useState(true)

  //state handler Functions
  const handleCurrentChannel = (id) =>{
    setCurrentChannel(id);
  }
  const populateChannelData = (data) =>{
    setChannelData(data)
  }
  //authentication:-
  const redirect = useNavigate();
  const onLogout= ()=>{
    localStorage.clear();
    setAuth({token: null, user: null});
    redirect('/');
  }
  const onLoginSuccess = (user, accessToken) =>{
    setAuth({
      user: user, 
      accessToken: accessToken, 
    });
    localStorage.setItem('has_session', 'true');
    redirect('/chatter')
  }
  const refresh = async ()=>{
    try{
      //checks if has session flag exists in local storage befor fetching data
      if(localStorage.getItem('has_session') !== 'true') throw new Error('No session Found')
      
      const response = await fetch('http://localhost:3000/auth/refresh',{
        method: "POST",
        credentials: 'include', //<= Important, this  is required to pass cookies
      })
      //console.log(response)
      if(response.status === 401)throw new Error(`${response.statusText}`)
      const result = await response.json()
      
      notify.success('Session Restored')
      setAuth({
        user:result.user,
        accessToken: result.accessToken
      })
      return {        
        user:result.user,
        accessToken: result.accessToken
      }
    }catch(err){
      console.log(err.message)
      notify.error(`${err.message}`)
      setAuth(null)
    }
  }
  //re-authenticate//handels both 401 and 403 casses
  const reAuth = async (response)=>{
    if(response.ok) return
    //handels forbidden access
      if(response.status === 403){
        notify.error('Forbidden')
        return redirect('/chatter')
      }
    // handels unauthentiated use
      if(response.status === 401){
        try{
          //retry to refresh access token logic:-
          const result = await refresh();
          return redirect('/chatter')
        }catch(err){
          notify.error(err.message)
        }
        return
      }
  }
  // App Data:-
  //fetches user, cahnnels,friends info to populate user dashboard
  const getDashbaordData = async(token)=>{
    const response = await fetch('http://localhost:3000/user/me',{
      method: "GET",
      headers: {
        "Content-Type": 'Application/json',
        "Authorization": `Bearer ${token}`,
      },
    })
    await reAuth(response);//handels 401 and 403 cases
    const result = await response.json()
    return {channels: result.channels, friends: result.friends}
  }
  const getChatlog = async(id) =>{
      try{
        setChatLoader(true);
          const response = await fetch(`http://localhost:3000/channel/${id}`,{
              method: 'GET',
              headers: {
                  "Content-Type": 'Application/json',
                  "Authorization": `Bearer ${auth.accessToken}`,
                  },
          })
          await reAuth(response);//handels 401 and 403 cases
          const result = await response.json()
          setChatLoader(false);
          return result
      }catch(err){
          notify.error(err.message)
          redirect('/')
      }
  }
//app navigationn
  const goTo = (path) =>{
    redirect(path)
  }
//Effects:-
  useEffect(()=>{
    const initAuth = async() =>{
      //intial onload page refresh

      refresh()
      try{
        //const result = await refresh();
        //console.log('refresh results: ', result);
        if(result && result.accessToken){
          redirect('/chatter')
        }else{
          throw new Error('Could not restor session, please log in')
        }
        setLoadingAuth(false);
      }catch(err){
        notify.warn(err.message)
        setLoadingAuth(false);
        redirect('/')
      }      
    }

    initAuth();
  },[])
  useEffect(()=>{
    if (!auth) return;
    const loadDashboard = async () =>{
      const dashboard = await getDashbaordData(auth.accessToken);
      console.log(dashboard)
      setChnls({channels: dashboard.channels, friends: dashboard.friends})
    }
    if(!currentChannel) return
      const loadChannel = async() =>{
          const result = await getChatlog(currentChannel);
          setChannelData(result)
      }
      
    loadDashboard()
    loadChannel();
  },[auth])
  useEffect(()=>{
    if (!auth) return;
    if(!currentChannel) return
      const loadChannel = async() =>{
          const result = await getChatlog(currentChannel);
          setChannelData(result)
          redirect('/chatter')
      }
      loadChannel();
      
  },[currentChannel])
  useEffect(()=>{
    if(!channelData)return
    setMembers(channelData.members)
  },[channelData])
// render while loading
  if(authLoading){
    return <div>Loading ...</div>
  }
//main render 
  return (
    <> 
      <div className={currentChannel? style.appContainer : style.appContainerProfile}>      
        <SideBar  channelView={channelView} 
        triggerChannelView={setChannelView}
                  chnls={chnls} 
                  auth={auth}
                  loadChannel={handleCurrentChannel}
                  />
        <Outlet context={{
          onLoginSuccess,
          onLogout,
          auth,
          reAuth,
          currentChannel,
          handleCurrentChannel,
          getChatlog,
          channelData,
          populateChannelData,
          chatLoader,
          goTo

        }}/>
        <MembersBar data={members} 
                    membersView={viewMembers}
                    triggerViewMember={setViewMembers} 
                    auth={auth}
                    currentChannel={currentChannel}
                    />
      </div>
      <ToastContainer
        theme='colored'
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Bounce}
      />
    </>
  )
}

export default App
