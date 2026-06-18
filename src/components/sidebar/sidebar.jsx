import style from './sidebar.module.css';
import { UserIcon, 
         FriendsIcon, 
         GroupIcon, 
         SearchIcon,
         SendIcon,
         LogoIcon,
         LeftArrow,
        RightArrow,
        BlockeIcon,
        Logout,
        PlusIcon} from '../iconhelper/iconHelper';
import { useSwipeable } from 'react-swipeable';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';

const SideBar = (
    {
        chnls, 
        channelView, 
        triggerChannelView, 
        auth,
        loadChannel, 
        logout,
        search
    }) =>{
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
        try{

            if(!data.friends)throw new Error('data.friends object not found')
            if(data.friends === 0)throw new Error(' no friends found')
            return data.friends.map(chnl=>{
                return (  
                    <div key={chnl.id} className={style.channelOption}
                        onClick={()=>{
                            loadChannel(chnl.channelId);
                        }}>
                        <div style={{gridArea: 'logo'}}><UserIcon/></div>
                        <div style={{gridArea: 'text'}}>{chnl.name}</div>
                    </div>                  
                )
            })
        }catch(err){
            return( 
                <div className={style.channelOption}>
                    <p style={{gridArea: 'text'}} >no Friends!</p> 
                </div>
                )
        }
    }

    const populateGroups = (data) =>{
        try{
            if( !data.channels) throw new Error('data.channels object not found')
            if(data.channels.length === 0)throw new Error('no channels found')
            return data.channels.map(chnl=>{
                if(chnl.type === "FRIEND")return
                return(
                    <div key={chnl.id} className={style.channelOption}
                        onClick={()=>{
                            loadChannel(chnl.id)
                        }}>
                        <div style={{gridArea: 'logo'}}><UserIcon/></div>
                        <div style={{gridArea: 'text'}}>{chnl.name}</div>
                    </div>                 
                )
            })
        }catch(err){
            console.log(err.message)
            return <div className={style.channelOption}>
                <div style={{gridArea: 'logo', alignContent: 'center'}}>
                    <BlockeIcon/>
                </div>
                <p style={{gridArea: 'text'}} >no data</p> 
            </div>
        }
    }
    // channel view toggle renderer:
    const toggleChannelBar = () =>{
        return channelView? (
            <div className={style.closeChannels}
                onClick={()=> toggelChannelView()}>
                <LeftArrow size={40}/>
            </div>  
        ):(
            <div className={style.openChannels}
                onClick={()=> toggelChannelView()}>
                <RightArrow size={40}/> 
            </div>                       
        )        
    }
    const displayChannels=()=>{
        if(friends){
            return(
                <>  
                    <div className={`${style.channelList} 
                        ${channelView? style.open: style.close}`}>
                            <div className={style.listHeader}>
                                <h3 style={{color: '#62646b'}}>Friends</h3> 
                            </div>
                            
                            {populateFrinds(chnls)}
                    </div>
                    {/*toggole channel sidebar view on and off via arrows:*/}
                    {toggleChannelBar()}
                </>  
            )
        }
        if(groups){
            return(
                <>  
                    <div className={`${style.channelList} 
                        ${channelView? style.open: style.close}`}>
                            <div className={style.listHeader}>
                                <h3 style={{color: '#62646b'}}>
                                    Groups  
                                </h3> 
                                <div title='Create New channel'>
                                    <PlusIcon />  
                                </div>                                     
                            </div>

                            {populateGroups(chnls)}                    
                    </div>
                    {/*toggole channel sidebar view on and off via arrows:*/}
                    {toggleChannelBar()}
                </> 
            )
        }

    }

    return(
        <div className={style.sideNav} {...swipeSidebar}>
            <div className={style.userNav}> 
                <div className={style.logo}
                    title='Return to home page'
                     onClick={()=> redirect('/Chatter')}>
                    Chatter<LogoIcon color={'#E84545'} size={25} />
                </div> 
                {auth? (
                    <>  
                        <div title='User Profile'>
                        <UserIcon 
                            color={'#27282c'}         
                            focusColor={'#62646b'} 
                            size={25}
                            fn={()=>{
                                redirect('/profile/me')
                            }}
                            />
                        </div>
                        <div
                            title='View Friends list' 
                            onClick={()=>{
                            if(friends)return
                            setGroups(false)
                            setFriends(true)
                        }}>
                            <FriendsIcon color={'#27282c'} focusColor={'#62646b'} size={25} />                            
                        </div>
                        <div
                            title='View Channels list'  
                            onClick={()=>{
                            if(groups)return
                            setFriends(false)
                            setGroups(true)
                        }}>
                            <GroupIcon color={'#27282c'} focusColor={'#62646b'} size={25} />
                        </div>

                        <div title='search channels & users'>
                            <SearchIcon color={'#27282c'} focusColor={'#62646b'} size={25} />                            
                        </div>

                        <div style={{marginTop: 'auto', paddingBottom: '20px'}}
                             title='Logout'>
                            <Logout color={'#27282c'} focusColor={'#62646b'} size={25}
                                fn={()=>{
                                    const confirm = window.confirm('This action will log you out of this device!')
                                    if(!confirm) return
                                    logout();
                                    redirect('/');
                                }}
                            />                          
                        </div>   
               
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