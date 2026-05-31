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

    //selects and returns a data array with the specified type
    const dataCleaner = (data,type)=>{
        return data.filter(channel => channel.type === type)
    }

    const populateFrinds = (data) =>{
        const sortedData = dataCleaner(data, 'FRIEND')

        if(sortedData.length === 0) return <div>no friends yet</div>
        return sortedData.map(chnl=>{
            return (  
                <div key={chnl.id} className={style.channelOption}>
                    <div><UserIcon/></div>
                    <div>{chnl.name}</div>
                </div>                  
            )

        })
    }
    const populateGroups = (data) =>{
        const sortedData = dataCleaner(data, 'GROUP');
        if(sortedData.length === 0)return <div>no Groups  yet</div>
        return data.map(chnl=>{
            return(
                <div key={chnl.id} className={style.channelOption}>
                    <div><UserIcon/></div>
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
                            <h3 style={{border: '1px solid green',textAlign:'center'}}>Friends</h3>
                            {chnls.length > 0? (
                                populateFrinds(chnls)
                            ):(
                                <div>
                                    {console.log(chnls.length)}
                                    no channels
                                </div>
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
                            <h3 style={{textAlign:'center'}}>Groups</h3>
                            {chnls.length > 0? (
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
                <div className={style.logo} onClick={()=> redirect('/')}>
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