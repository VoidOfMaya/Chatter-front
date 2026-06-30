import { useEffect, useState, useRef} from 'react'
import style from './App.module.css'
import { Outlet ,useNavigate } from 'react-router-dom'
import { SideBar } from './components/sidebar/sidebar';
import { MembersBar } from './components/members/members';
import {ToastContainer, Bounce} from 'react-toastify'
import { notify } from './components/norifications/notifications';
import { NewGroupDialog } from './components/dialogs/dialogs';

function App() {
  //authentication state
  const [auth, setAuth]= useState(null);//holds user auth data and tokens
  
  //component hide/show state:-
  const [channelView,setChannelView]=useState(true);//sidebar channel list display toggle
  const [viewMembers,setViewMembers]=useState(false);//members list display toggle

  const [displayDialog, setDisplayDialog] = useState(false)//displays create group dialog
  const newGroupRef = useRef(null)
  //const [search, setSearch]= useState(false);// handels displaying search dialog

  //dashboard data states:-
  const [chnls, setChnls] = useState(null);//holds channel data user has
  const [members, setMembers] = useState(null);//list of channel members per channel

  //current Channel state:-
  const [currentChannel, setCurrentChannel]= useState(1);
  const [channelData, setChannelData] = useState(null) ;

  //inbox state:-
  const [inbox, setInbox] = useState(null);

  // temporary loading states :-
  const [chatLoader, setChatLoader] = useState(true);
  const [authLoading, setLoadingAuth] = useState(true);

  //global app update state :- should trigger refetch data
  const [update, setUpdate] = useState(false)



  //state handler Functions
  const showDialog = () =>{
    console.log('setting state')
    setDisplayDialog(true)
  }
  const handleCurrentChannel = (id) =>{
    setCurrentChannel(id);
  }
  const populateChannelData = (data) =>{
    setChannelData(data)
  }
  const updateApp =()=>{
    console.log(`updating app`)
    setUpdate(prev => !prev);
  }
  //authentication:-
  const redirect = useNavigate();
  const onLogout= ()=>{
    
    localStorage.clear();
    setAuth({token: null, user: null});
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
        console.log('reauth error 403')
        return //redirect('/chatter')
      }
    // handels unauthentiated use
      if(response.status === 401){
        try{
          //retry to refresh access token logic:-
          const result = await refresh();
          if(!result) throw new Error('could not refresh')
          return result
        }catch(err){
          console.log('re-auth error')
          console.log(err)
          notify.error( err.message);
          redirect('/');
        }
        return
      }
  }
  // App Data:-
  //fetches user, cahnnels,friends info to populate user dashboard
  const getDashbaordData = async(token)=>{
    if(!auth.user)return
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
    if(!auth.user)return
      try{
        setChatLoader(true);
          const response = await fetch(`http://localhost:3000/channel/${id}`,{
              method: 'GET',
              headers: {
                  "Content-Type": 'Application/json',
                  "Authorization": `Bearer ${auth.accessToken}`,
                  },
          })
          console.log('inside chatlog fetcher, pre Reauth')
          await reAuth(response);//handels 401 and 403 cases
          console.log('inside chatlog fetcher, Post Reauth')
          const result = await response.json()
          setChatLoader(false);
          return result
      }catch(err){
          notify.error(err.message)
          console.log(err || err.messaage || err.msg)
          //redirect('/')
      }
  }
  // fetch pending requests
  const getPendingRequests= async(token) =>{
    try{
      const response = await fetch(`http://localhost:3000/friend/requests`,{
        method: 'GET',
        headers:{"Authorization": `Bearer ${token}`}
      })
      await reAuth(response);
      const result = await response.json();
      if(!response.ok) throw new Error(`${result.msg}`)
  
      return(result)
    }catch(err){
      notify.error(err)
    }

  }
  //update inbox:-
  const loadInbox = async() =>{
    const result = await getPendingRequests(auth.accessToken);
    setInbox(result);
  }
//app navigationn
  const goTo = (path) =>{
    redirect(path)
  }
//Effects:-
  useEffect(()=>{
    const initAuth = async() =>{
      //intial onload page refresh
      //refresh()
      try{
        const result = await refresh();
        //console.log( result);
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
    console.log(`auth effect accessed`)
    if (!auth) return;
    console.log('fetching app data')
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
    loadInbox();
    loadDashboard();
    loadChannel();
  },[auth])
  useEffect(()=>{
    if (!auth) return console.log(`attempting to load current channe;, no AUTH`);
    if(!currentChannel) return
      const loadChannel = async() =>{
          console.log(`fetching chat data at: ${currentChannel}`)
          const result = await getChatlog(currentChannel);
          setChannelData(result)
          goTo('/chatter')
      }
      loadChannel();
      
  },[currentChannel])
  useEffect(()=>{
    if(!channelData)return
    console.log(channelData.members)
    setMembers(channelData.members)
    //console.log(channelData)
  },[channelData])
  useEffect(()=>{

  },[inbox])
  useEffect(()=>{
    console.log(`app update effect running`)
    const loadDashboard = async () =>{
      const dashboard = await getDashbaordData(auth.accessToken);
      console.log(dashboard)
      setChnls({channels: dashboard.channels, friends: dashboard.friends})
    }
    loadDashboard();
    loadInbox();
  },[update])
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
                  reAuth={reAuth}
                  auth={auth}
                  loadChannel={handleCurrentChannel}
                  logout={onLogout}
                  inbox={inbox}
                  showDialog={showDialog}
                  />
        <Outlet context={{
          onLoginSuccess,
          onLogout,
          auth,
          reAuth,
          currentChannel,
          handleCurrentChannel,
          getChatlog,
          chnls,
          channelData,
          updateApp,
          populateChannelData,
          chatLoader,
          inbox,
          loadInbox,
          goTo

        }}/>
        <MembersBar data={members} 
                    membersView={viewMembers}
                    triggerViewMember={setViewMembers} 
                    auth={auth}
                    currentChannel={currentChannel}
                    />
      </div>
      {displayDialog? (
          <div className={style.createGroupDialog}>
              < NewGroupDialog 
              referance={newGroupRef}  c
              lose={()=>setDisplayDialog(false)}
              auth={auth}
              reAuth={reAuth}
              />
          </div>
        ):('')}   
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
