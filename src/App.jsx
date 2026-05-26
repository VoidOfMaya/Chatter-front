import { useEffect, useState} from 'react'
import style from './App.module.css'
import { Outlet ,useNavigate } from 'react-router-dom'
import { SideBar } from './components/sidebar/sidebar';
import { MembersBar } from './components/members/members';
import { useSwipeable} from 'react-swipeable';
import {ToastContainer, toast, Bounce} from 'react-toastify'

function App() {
  const [channelView,setChannelView]=useState(true)
  const [chnls, setChnls] = useState(null);
  const [members, setMembers] = useState(null);
  const [viewMembers,setViewMembers]=useState(true)
  const [auth, setAuth]= useState(null);
  const [authLoading, setLoadingAuth] = useState(true)

  //LOGIC====================
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
    })
    redirect('/chatter')
  }
  //handels reauthentication without login{so long as refresh token valid}
  const refresh = async ()=>{
    try{
      const response = await fetch('http://localhost:3000/auth/refresh',{
        method: "POST",
        credentials: 'include', //<= Important, this  is required to pass cookies
      })
      console.log(response.status)
      if(response.status === 401){
        setAuth(null);
        noteErrorHandler('Session not found!')
        return
      }
      const result = await response.json()
      //console.log(result)
      noteSuccessHandler('Session Restored')
      setAuth({
        user:result.user,
        accessToken: result.accessToken
      })
      redirect('/chatter')
    }catch(err){
      console.log(err)
      noteErrorHandler(err.message)
      setAuth(null)
    }
  }
  //fetches user, cahnnels,friends info to populate user dashboard
  const getDashbaordData = async()=>{
    const response = await fetch('http://localhost:3000/user/me',{
      method: "GET",
      headers: {
        "Content-Type": 'Application/json',
        "Authorization": `Bearer ${auth.accessToken}`,
      },
    })
    console.log(response.status)
      if(response.status === 401){
        noteErrorHandler('dashboar data not found!')
        redirect('/')
        return
      }
      const result = await response.json()
      console.log(result)
      setChnls(result.channels)
      
  }
  useEffect(()=>{
    if(auth){
      getDashbaordData();
    }
  },[auth])
  useEffect(()=>{
    refresh();
  },[])

  //notrfication handling with toastify
  const noteSuccessHandler = (message) =>{
    toast.success(message,{
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true, 
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    })
  }
  const noteWarningHandler = (message) =>{
    toast.warn(message,{
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    })
  }
  const noteErrorHandler = (message) =>{
    toast.error(message,{
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    })
  }
  return (
    <>
    
      <div className={style.appContainer}>      
      <SideBar  channelView={channelView} 
      triggerChannelView={setChannelView}
                chnls={chnls}
                auth={auth} 
                />
      <Outlet context={{
        onLoginSuccess,
        onLogout,
        auth,
        noteSuccessHandler,
        noteWarningHandler,
        noteErrorHandler
      }}/>
      <MembersBar data={members} 
                  membersView={viewMembers}
                  triggerViewMember={setViewMembers} 
                  auth={auth}
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
