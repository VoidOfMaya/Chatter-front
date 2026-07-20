import { useEffect, useState, useRef} from 'react'
import style from './App.module.css'
import { data, Outlet ,useNavigate } from 'react-router-dom'
import { SideBar } from './components/sidebar/sidebar';
import { MembersBar } from './components/members/members';
import {ToastContainer, Bounce} from 'react-toastify'
import { notify } from './components/norifications/notifications';
import { NewGroupDialog } from './components/dialogs/dialogs';
import { wsio } from './components/sockets/mainSocket';

function App() {
  //authentication state
  const [auth, setAuth]= useState({accessToken: null, user: null});//holds user auth data and tokens
  const socket = useRef(null)
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
  const [dataLoading, setDataLoading] = useState(true) 

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
  const resetAppState = () =>{
    wsio.disconnect()
    setChnls(null);
    setMembers(null);
    setCurrentChannel(1);
    setChannelData(null);
    setInbox(null);
    setChatLoader(true);
    setDisplayDialog(false);
    setUpdate(false);
    setDataLoading(true);
  }
  //authentication:-
  const redirect = useNavigate();
  const onLogout= async()=>{
    try{
      const response = await callApi({
        method:'DELETE',
        path: `auth/logout`,
        requiresAuth: true,
        includeCred: true,
      })
      if(!response.ok) throw new Error (`${response.message}`)
      localStorage.clear();
      resetAppState();
      setAuth({accessToken: null, user: null});
      redirect('/')
    }catch(err){
      notify.err(err.message)
    }
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
      console.log(err.message)
      notify.error(`${err.message}`)
      setAuth({token: null, user: null})
      localStorage.clear()
    }
  }
  //re-authenticate//handels both 401 and 403 casses
  const reAuth = async (response)=>{
    if(response.status !== 401) return;
    try{
      //retry to refresh access token logic:-
      const result = await refresh();
      if(!result){ 
        localStorage.clear();
        throw new Error('could not refresh')
      }
      return result
    }catch(err){
        console.log('re-auth error')
        console.log(err)
        localStorage.clear();
        notify.error( err.message);
        redirect('/');
    }
  }
  //RESTapi request constructor:
  const authPromis = useRef(null) //
  const callApi = async(options)=>{
    //options: {method, path, requiresAuth,body, includeCred,retry}
    //validate and set options
    if(!options) throw new Error(`No options where provided for api to call`);
    if(!options.path)throw new Error(`No path was provided for api to call`);
    if(!options.method)throw new Error(`no method provided for api to call`);
    if(options.retry === undefined) options.retry = true
    //construct fetch request body
    const createHeader = (token = auth.accessToken)=>{
      const headers = {}
      if( options.requiresAuth ){
        headers.Authorization = `Bearer ${token}`;
      }
      if(options.body && !(options.body instanceof FormData)){
        headers["Content-Type"]= 'Application/json';
      }
      return headers
    }
    const constructReqBody = (header) =>{
    if(options.body){
      return{
        method: `${options.method}`,
        headers: header,
        // formedata checker!
        body: 
          options.body instanceof FormData?
            options.body : JSON.stringify(options.body)
      }
    }else{
      return{
        method: `${options.method}`,
        headers: header
      } 
    }
    }
    const header =createHeader(options.token);
 
    const fetchData = constructReqBody(header)
    // includes credentials to body if 
    if(options.includeCred) fetchData.credentials = 'include';
    //fetch
    const response = await fetch(
    `${import.meta.env.VITE_API_URL}/${options.path}`,
      fetchData
    )
    //return if valid
    if(response.ok) return response;
     //if  status ===401 attempt fetch define retry as false
    if(response.status === 401){ 
      
      //validating singletone refresh
      if(!authPromis.current){
        authPromis.current= reAuth(response)
        .finally(()=>{
          authPromis.current= null; //once promise resolves  reset refreshState
        })
      }
      //reAuthenticating
      const newAuth = await authPromis.current;//turns to a promise on refresh
      if(!newAuth) return response;
      //if retry = true  recall call api with retry attribute set to false
      if(!options.retry) return response;
      const retryResponse = await callApi({
        method: options.method,
        path: options.path,
        requiresAuth: options.requiresAuth,
        body: options.body,
        token: newAuth.accessToken,
        retry: false
      })
      //if on retry still 401 wipe data and prompt log in
      if(retryResponse.status === 401){
        setAuth({user: null, accessToken: null})
        localStorage.clear();
        wsio.disconnect()
        redirect('/')
      }
      //if retry valid(403 forbidden is valid still for auth purposes)return result!
      return retryResponse
    }
    return response
  }

  // App Data:-
  //fetches user, cahnnels,friends info to populate user dashboard
  const getDashbaordData = async()=>{
    if(!auth.user)return
    const response = await callApi({
      method: 'GET',
      path:'user/me',
      requiresAuth:true
    })
    if(!response.ok) throw new Error(`${response.message}`)
    const result = await response.json()
    return {channels: result.channels, friends: result.friends}
  }
  const getChannel = async(id) =>{
    if(!auth.user)return
      try{
        setChatLoader(true);
        const response = await callApi({
          method: 'GET',
          path:`channel/${id}`,
          requiresAuth:true
        })
        if(!response.ok) throw new Error(`${response.message}`)
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
  const getPendingRequests= async() =>{
    try{
      const response = await callApi({
        method: 'GET',
        path:'friend/requests',
        requiresAuth:true
      })
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
    const result = await getPendingRequests();
    setInbox(result);
  }
//app navigationn
  const goTo = (path) =>{
    redirect(path)
  }
  //current channel setter
  const loadChannel = async() =>{
    const result = await getChannel(currentChannel);
    setChannelData(result)
    goTo('/chatter')
  }
//Effects:-
  useEffect(()=>{
    const initAuth = async() =>{
      try{
        const result = await refresh();

        if(result && result.accessToken){
          redirect('/chatter')
        }else{
          throw new Error('Could not restor session, please log in')
        }
        //setLoadingAuth(false);
      }catch(err){
        notify.warn(err.message)
        localStorage.clear();
        redirect('/')
      }finally{
        setLoadingAuth(false);
      }
    }

    initAuth();
  },[])
  useEffect(()=>{
    if (!auth?.user) {
      setDataLoading(false);
      return;
    };
    console.log('fetching app data')
    const load = async () =>{
      const dashboard = await getDashbaordData();
      const inbox = await getPendingRequests()

      setChnls({channels: dashboard.channels, friends: dashboard.friends})
      setInbox(inbox);
    
      if(currentChannel){
        await loadChannel();      
      }
      setDataLoading(false)
    }
  load()  
  },[auth])
  //newEffect
  useEffect(() => {
  if (!auth?.user) return;
  if(dataLoading) return;
  //create socket client
  console.log('data has loaded')
  socket.current = wsio.connect(auth.accessToken);
  //send event to server
  if (!socket.current) return;
  socket.current.emit('user_connected',()=>{
    console.log('userConnected')
  })

  // handels data updating regarding user online status
  const onlineStatusHandler = (data) =>{
   setChnls(prev=>({
      ...prev,friends: prev.friends.map(f=>{
            if(f.id === data.id){
              return{...f,onlineStatus: data.isOnline}
            }
            return f
          })
    }))
  }
  if (!socket.current) return;
  socket.current.on('friend_online',onlineStatusHandler)
  socket.current.on("friend_offline",onlineStatusHandler)
  //cleaner function
  return ()=>{
    socket.current.off('friend_online',onlineStatusHandler)
    socket.current.off("friend_offline",onlineStatusHandler)
  }

},[auth, dataLoading]);
  useEffect(()=>{
    if (!auth.user || dataLoading || !currentChannel) return
    loadChannel();
  },[currentChannel])
  useEffect(()=>{
    if(!channelData|| !channelData.members)return
    setMembers(channelData.members.filter(record => record.isMember))
  },[channelData])
  useEffect(()=>{
    if(!auth || !auth.user || dataLoading) return
    const loadDashboard = async () =>{
      const dashboard = await getDashbaordData();
      if(!dashboard) return
      setChnls({channels: dashboard.channels, friends: dashboard.friends})
      loadInbox()
    }
    loadDashboard();
    //loadInbox();
  },[update])
// render while loading
  if(authLoading || dataLoading){
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
          socket,
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
          goTo,
          callApi,

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
