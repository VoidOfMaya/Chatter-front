import { 
    GroupIcon, 
    LeftArrow, 
    RightArrow, 
    ShieldIcon,
    UserIcon } from '../iconhelper/iconHelper';
import style from './members.module.css'
import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';


const MembersBar = ({data, membersView, triggerViewMember,auth,currentChannel}) =>{
    const toggelMembersView=()=>{
        triggerViewMember(!membersView);
    }
    const swipeMembersBar = useSwipeable({
        onSwipedLeft: () => triggerViewMember(true),
        onSwipedRight: () => triggerViewMember(false),
    });
    const toggleArrows = () =>{
        return(
            <>
                {!membersView? (
                    <div className={style.closeChannels}>
                        <LeftArrow size={40} fn={toggelMembersView}/>
                    </div>  
                ):(
                    <div className={style.openChannels}>
                        <RightArrow size={40} fn={toggelMembersView}/> 
                    </div>                       
                )}
            </>
        )
    }
    //enable clicking on user profile through members tab!
    const populateMembers=()=>{
        if (!data) return 'no members yet!'
        return data.map(member =>{
            return(
                <div key={member.user.id} 
                    className={`${member.isMod? style.modCard:style.memberCard}
                    ${member.user.id === auth.user.id?style.meCard:''}
                    ${style.card}
                    `}
                >   {member.user.photo?
                    (
                        <img src={member.user.photo} 
                            className={style.pfp}
                            width='30px'
                            height='30px'
                        />
                    ):(<UserIcon size={30} focusColor="#27282c"/>)
                }
                    @{member.user.name}
                    {member.isMod? (<ShieldIcon color='#E84545' size={15} focusColor='red'/>):('')}
                </div>
            )
        }) 
    }
    if (!auth?.user) return null;
    return(
        <>
            <div className={style.membersSidebar}
                style={currentChannel? {display: 'block'}: {display: 'none'}} 
            >  
                {!membersView?(
                    //VIEW GROUP MEMBERS TOGGLER
                    //if membersview is open then display close arrow
                    <div className={style.displayChannels}>
                        <LeftArrow size={40} fn={()=>toggelMembersView()}/>
                    </div>   
                ):(
                    //if membersview is closed then display open arrow
                    <div className={style.displayChannels}>
                        <RightArrow size={40} fn={()=>toggelMembersView()}/>
                    </div>
                )} 
                <div className={`
                        ${style.membersContainer}
                        ${membersView? style.open: style.close}
                    `}
                    {...swipeMembersBar}>
                        <div className={style.title}>
                            <GroupIcon size={35} />
                            Members                            
                        </div>
                    <div className={style.groupMembers}>
                        {populateMembers()}
                    </div>
                </div>        
            </div>               
        </>


    )
}
export{
    MembersBar
}