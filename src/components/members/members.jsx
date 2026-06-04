import { GroupIcon, LeftArrow, RightArrow } from '../iconhelper/iconHelper';
import style from './members.module.css'
import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';


const MembersBar = ({data, membersView, triggerViewMember,auth}) =>{
    const toggelMembersView=()=>{
        triggerViewMember(!membersView);
    }
    const swipeMembersBar = useSwipeable({
        onSwipedLeft: () => triggerViewMember(true),
        onSwipedRight: () => triggerViewMember(false),
    });

    const populateMembers=()=>{
        if (!data) return 'no members yet!'
        return data.map(member =>{
                    return(
                        <div key={member.user.id} style={member.is_mod? {color: 'green'}:{color: 'white'}}>
                            @{member.user.name}
                        </div>
                    )
                }) 
    }
    return(
        <>
            {auth? (
                <div className={style.membersContainer} {...swipeMembersBar}>
                    <div className={`${style.groupMembers} 
                    ${membersView? style.open: style.close}`}>
                        <div className={style.title}>
                            <GroupIcon size={35} />
                            Members                            
                        </div>

                        {populateMembers()}
                    </div>
                    {!membersView? (
                        <div className={style.closeChannels}>
                        <LeftArrow size={40} fn={toggelMembersView}/>
                        </div>  
                    ):(
                        <div className={style.openChannels}>
                        <RightArrow size={40} fn={toggelMembersView}/> 
                        </div>                       
                    )}        
                </div>                
            ):(
                <></>
            )}
        </>


    )
}
export{
    MembersBar
}