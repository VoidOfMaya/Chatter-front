import { useEffect, useState } from 'react'
import style from './App.module.css'
import { Outlet ,useNavigate } from 'react-router-dom'
import { SideBar } from './components/sidebar/sidebar';
import { MembersBar } from './components/members/members';
import { useSwipeable} from 'react-swipeable';
import { channels, channel_members} from './mock/data'; 

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
  const onLoginSuccess = (user, token) =>{
    setAuth({user: user, token: token})
    redirect('/chatter')
  }
  useEffect(()=>{
    setChnls(channels);
    setMembers(channel_members);
    console.log(auth);
  },[auth])
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
        auth
      }}/>
      <MembersBar data={members} 
                  membersView={viewMembers}
                  triggerViewMember={setViewMembers} 
                  auth={auth}
                  />
      </div>
    </>
  )
}

export default App
