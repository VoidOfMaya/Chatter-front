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
  const [auth, setAuth]= useState({token: null, user: null});//holds user auth data and tokens
  
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
    setDisplayDialog(true)
  }
  const handleCurrentChannel = (id) =>{
    setCurrentChannel(id);
  }
  const populateChannelData = (data) =>{
    setChannelData(data)
  }
  const updateApp =()=>{
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
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`,{
        method: "POST",
        credentials: 'include', //<= Important, this  is required to pass cookies
      })
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
      console.log(err)
      notify.error(`${err.message}`)
      setAuth({token: null, user: null})
      localStorage.clear
    }
  }
  //re-authenticate//handels both 401 and 403 casses
  const reAuth = async (response)=>{
    if(!response.response.status === 401) return;
    try{
      //retry to refresh access token logic:-
      const result = await refresh();
      if(!result){ 
        localStorage.clear();
        throw new Error('could not refresh')
      }
      return true
    }catch(err){
        console.log('re-auth error')
        console.log(err)
        localStorage.clear();
        notify.error( err.message);
        redirect('/');
    }
  }
  //api request constructor:
  const callApi = async(options)=>{
    if(!options) throw new Error(`No options where provided for api to call`);
    if (!options.path)throw new Error(`No path was provided for api to call`);
    if (!options.method)throw new Error(`no method provided for api to call`);
    //options include: (example)
    /*{
    method: 'GET' type string defines request method
    path:'/example/example' type string defines which resource to call
    protected: true, type boolean defines if request is protected
    body:{jsonObj} type object or null if not defined, sets sent objects
    }*/
   // default values when not provided in options
    
    const createHeader = ()=>{
      const headers = {}
      if( options.protected ){
        headers.Authorization = `Bearer ${auth.accessToken}`;
      }
      if(options.body){
        headers["Content-Type"]= 'Application/json';
      }
      return headers
   }
   const reqMetadata = (header) =>{
    if(options.body){
      return{
        method: `${options.method}`,
        headers: header,
        body: JSON.stringify(options.body)
      }
    }else{
      return{
        method: `${options.method}`,
        headers: header
      } 
    }
   }
    const header = createHeader();
    const fetchData = reqMetadata(header)

    const request = await fetch(
    `${import.meta.env.VITE_API_URL}/${options.path}`,
      fetchData
   )
  }
  // App Data:-
  //fetches user, cahnnels,friends info to populate user dashboard
  const getDashbaordData = async(token)=>{
    if(!auth.user)return
    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/me`,{
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
  const getChannel = async(id) =>{
    if(!auth.user)return
      try{
        setChatLoader(true);
          const response = await fetch(`${import.meta.env.VITE_API_URL}/channel/${id}`,{
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
          console.log(err || err.messaage || err.msg)
          //redirect('/')
      }
  }
  // fetch pending requests
  const getPendingRequests= async(token) =>{
    try{
      const response = await fetch(`${import.meta.env.VITE_API_URL}/friend/requests`,{
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
    if(!auth.user) return
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

        if(result && result.accessToken){
          redirect('/chatter')
        }else{
          throw new Error('Could not restor session, please log in')
        }
        setLoadingAuth(false);
      }catch(err){
        notify.warn(err.message)
        localStorage.clear();
        setLoadingAuth(false);
        redirect('/')
      }      
    }

    initAuth();
  },[])
  useEffect(()=>{
    if (!auth ||!auth.user) return;
    console.log('fetching app data')
    const loadDashboard = async () =>{
      const dashboard = await getDashbaordData(auth.accessToken);
      setChnls({channels: dashboard.channels, friends: dashboard.friends})
    }
    if(!currentChannel) return
      const loadChannel = async() =>{
          const result = await getChannel(currentChannel);
          setChannelData(result)
      }
    loadInbox();
    loadDashboard();
    loadChannel();
  },[auth])
  useEffect(()=>{
    if (!auth.user) return
    if(!currentChannel) return
      const loadChannel = async() =>{
          const result = await getChannel(currentChannel);
          setChannelData(result)
          goTo('/chatter')
      }
      loadChannel();
      
  },[currentChannel])
  useEffect(()=>{
    if(!channelData)return
    setMembers(channelData.members.filter(record => record.isMember))
  },[channelData])
  useEffect(()=>{

  },[inbox])
  useEffect(()=>{
    if(!auth || !auth.user) return
    const loadDashboard = async () =>{
      if(!auth.user) return
      const dashboard = await getDashbaordData(auth.accessToken);
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
          getChannel,
          chnls,
          channelData,
          members,
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
              referance={newGroupRef}  
              close={()=>setDisplayDialog(false)}
              auth={auth}
              reAuth={reAuth}
              updateApp={updateApp}
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
