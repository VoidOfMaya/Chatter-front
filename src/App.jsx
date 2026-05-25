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

  //LOGIC====================

  const redirect = useNavigate();
  const onLogout= ()=>{
    localStorage.clear();
    setAuth({token: null, user: null});
    redirect('/');
  }
  const onLoginSuccess = (threadId, user, accessToken,refreshToken) =>{
    setAuth({
      threadId: threadId,
      user: user, 
      accessToken: accessToken, 
      refreshToken: refreshToken 
    })
    redirect('/chatter')
  }
  useEffect(()=>{
    console.log(auth);
  },[auth]);

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
