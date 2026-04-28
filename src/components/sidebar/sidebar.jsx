import style from './sidebar.module.css';
import { UserIcon, 
         FriendsIcon, 
         GroupIcon, 
         SearchIcon,
         SendIcon,
         LogoIcon,
         LeftArrow,
        RightArrow} from '../iconhelper/iconHelper';

import { useSwipeable } from 'react-swipeable';
import { useNavigate } from 'react-router-dom';
import { Friends } from '../friends/frinds';
import { useState } from 'react';

const SideBar = ({chnls, channelView, triggerChannelView, auth}) =>{
    const [friends, setFriends]= useState(true);
    const [groups, setGroups]= useState(false)
    const redirect = useNavigate();
    const toggelChannelView=()=>{
        triggerChannelView(!channelView);
    }
    const swipeSidebar = useSwipeable({
        onSwipedLeft: () => triggerChannelView(false),
        onSwipedRight: () => triggerChannelView(true),
    });

    const populateFrinds = (data) =>{
        return data.map(chnl=>{
            return(
                <div key={chnl.id} className={style.channelOption}>
                    <div><UserIcon/></div>
                    <div>{chnl.name}</div>
                </div>
            )
        })
    }
    const populateGroups = (data) =>{
        return data.map(chnl=>{
            return(
                <div key={chnl.id} className={style.channelOption}>
                    <div><GroupIcon/></div>
                    <div>{chnl.name}</div>
                </div>
            )
        })
    }
    const displayChannels=()=>{
        if(friends){
            return(
                <>  
                    <div className={`${style.channelList} 
                        ${channelView? style.open: style.close}`}>
                            Friends
                            {chnls? (
                                populateFrinds(chnls)
                            ):(
                                'no channels'
                            )}                    
                    </div>
                    {channelView? (
                        <div className={style.closeChannels}
                            onClick={()=> toggelChannelView()}>
                            <LeftArrow size={40}/>
                        </div>  
                    ):(
                        <div className={style.openChannels}
                            onClick={()=> toggelChannelView()}>
                            <RightArrow size={40}/> 
                        </div>                       
                    )}
                </>  
            )
        }
        if(groups){
            return(
                <>  
                    <div className={`${style.channelList} 
                        ${channelView? style.open: style.close}`}>
                            Groups
                            {chnls? (
                                populateGroups(chnls)
                            ):(
                                'no channels'
                            )}                    
                    </div>
                    {channelView? (
                        <div className={style.closeChannels}
                             onClick={()=> toggelChannelView()}>
                            <LeftArrow size={40}/>
                        </div>  
                    ):(
                        <div className={style.openChannels}
                             onClick={()=> toggelChannelView()}>
                            <RightArrow size={40}/> 
                        </div>                       
                )}
            </> 
            )
        }
    }
    return(
        <div className={style.sideNav} {...swipeSidebar}>
            <div className={style.userNav}> 
                <div className={style.logo} onClick={()=> console.log(auth)}>
                    Chatter<LogoIcon color={'#E84545'} size={25} />
                </div> 
                {auth? (
                    <>  
                        <div>
                        <UserIcon 
                            color={'#27282c'}         
                            focusColor={'#62646b'} 
                            size={25}
                            fn={()=>redirect('/profile/me')}
                            />
                        </div>
                        <div onClick={()=>{
                            if(friends)return
                            setGroups(false)
                            setFriends(true)
                        }}>
                            <FriendsIcon color={'#27282c'} focusColor={'#62646b'} size={25} />                            
                        </div>
                        <div onClick={()=>{
                            if(groups)return
                            setFriends(false)
                            setGroups(true)
                        }}>
                            <GroupIcon color={'#27282c'} focusColor={'#62646b'} size={25} />
                        </div>

                        <div></div>
                        <SearchIcon color={'#27282c'} focusColor={'#62646b'} size={25} />                    
                    </>
                ):(<></>)}                       

            </div>
            {auth?(
                displayChannels()
            ):(<></>)}
        </div>
    )
}
export{
    SideBar,
}