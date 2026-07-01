import { useState } from "react"
import style from "./icons.module.css"

const UserIcon =({fn = null, color ='#27282c', focusColor='#62646b', size=25})=>{
    const [focuse, setFocus]= useState(false);
    return(
        <svg xmlns="http://www.w3.org/2000/svg" 
            width={`${size}px`}
            height={`${size}px`}
            viewBox="0 -960 960 960"
            fill={focuse? focusColor : color}
                onMouseEnter={()=>setFocus(true)}
                onMouseLeave={()=>setFocus(false)}
            onClick={()=> fn? fn(): null}>
            <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-43-43Zm0 360Z"    
            />
        </svg>
    )
}
const SendIcon = ({fn = null, color ='#27282c', focusColor='#62646b', size=25})=>{
    const [focuse, setFocus]= useState(false);
    return(
        <svg xmlns="http://www.w3.org/2000/svg" 
            height={`${size}px`} 
            viewBox="0 -960 960 960" 
            width={`${size}px`}
            fill={focuse? focusColor : color}
                onMouseEnter={()=>setFocus(true)}
                onMouseLeave={()=>setFocus(false)}
            onClick={()=> fn? fn(): null}>
            <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/>
        </svg>
    )
}
const SearchIcon = ({fn = null, color ='#27282c', focusColor='#62646b', size=25})=>{
    const [focuse, setFocus]= useState(false);
    return(
        <svg xmlns="http://www.w3.org/2000/svg" 
            height={`${size}px`} 
            viewBox="0 -960 960 960" 
            width={`${size}px`}
            fill={focuse? focusColor : color}
                onMouseEnter={()=>setFocus(true)}
                onMouseLeave={()=>setFocus(false)}
            onClick={()=> fn? fn(): null}>
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
        </svg>
    )
}
const FriendsIcon = ({fn = null, color ='#27282c', focusColor='#62646b', size=25})=>{
    const [focuse, setFocus]= useState(false);
    return(
        <svg xmlns="http://www.w3.org/2000/svg" 
            height={`${size}px`} 
            viewBox="0 -960 960 960" 
            width={`${size}px`}
            fill={focuse? focusColor : color}
                onMouseEnter={()=>setFocus(true)}
                onMouseLeave={()=>setFocus(false)}
            onClick={()=> fn? fn(): null}>
            <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM247-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47Zm466 0q-47 47-113 47-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113q0 66-47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q440-607 440-640t-23.5-56.5Q393-720 360-720t-56.5 23.5Q280-673 280-640t23.5 56.5Q327-560 360-560t56.5-23.5ZM360-240Zm0-400Z"/>
        </svg>
    )
}
const GroupIcon = ({fn = null, color ='#27282c', focusColor='#62646b', size=25})=>{
    const [focuse, setFocus]= useState(false);
    return(
        <svg xmlns="http://www.w3.org/2000/svg" 
            height={`${size}px`} 
            viewBox="0 -960 960 960" 
            width={`${size}px`}
            fill={focuse? focusColor : color}
                    onMouseEnter={()=>setFocus(true)}
                    onMouseLeave={()=>setFocus(false)}
            onClick={()=> fn? fn(): null}>
            <path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"/>
        </svg>
    )
}
const LogoIcon = ({fn = null, color, focusColor, size})=>{
    const [focuse, setFocus]= useState(false);
    return(
        <svg className={style.logoIconIcon}
             width={`${size}px`}
             height={`${size}px`} 
             viewBox="0 0 512 512" 
             fill={focuse? focusColor : color}
                onMouseEnter={()=>setFocus(true)}
                onMouseLeave={()=>setFocus(false)} 
             xmlns="http://www.w3.org/2000/svg"
             onClick={()=> fn? fn(): null}>
            <path 
            d="M481.508 40.3341C475.95 34.7766 467.533 33.2504 460.364 36.4883L42.3642 225.488C35.0346 228.804 30.8225 236.452 31.956 244.385C33.0894 252.319 39.2312 258.455 47.1654 259.578L197.808 280.93L415.666 94.3333L231.065 311.63L252.417 462.273C253.541 470.207 259.677 476.349 267.61 477.482C268.611 477.625 269.615 477.695 270.615 477.695C277.652 477.695 284.14 473.493 286.953 466.885L475.953 48.8851C479.191 41.7155 477.123 33.5116 481.508 40.3341Z" 
            />
        </svg>
    )
}
const ReplyIcon = ({fn = null, color, focusColor, width, height})=>{
    const [focuse, setFocus]= useState(false);
    return(
        <div className={style.replyIcon}>
        <svg viewBox="0 0 24 24" 
             fill="none" 
             xmlns="http://www.w3.org/2000/svg"
             width={'100%'}
             height={`${height}px`}
             onClick={()=> fn? fn(): null}>
            <path 
                d="M12 19V9.5C12 7.01472 14.0147 5 16.5 5H900" 
                stroke={focuse? focusColor : color}
                onMouseEnter={()=>setFocus(true)}
                onMouseLeave={()=>setFocus(false)}
                strokeWidth="1" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
        </svg>
        </div>

    )
}
const LeftArrow = ({fn = null, color ='#27282c', focusColor='#62646b', size=25})=>{
    const [focuse, setFocus]= useState(false);
    return(
        <svg xmlns="http://www.w3.org/2000/svg" 
            height={`${size}px`}  
            viewBox="0 -960 960 960" 
            width={`${size}px`} 
            fill={focuse? focusColor : color}
                    onMouseEnter={()=>setFocus(true)}
                    onMouseLeave={()=>setFocus(false)}
            onClick={()=> fn? fn(): null}>
            <path d="M440-280v-400L240-480l200 200Zm80 160h80v-720h-80v720Z"/>
        </svg>
    )
}
const RightArrow = ({fn = null, color ='#27282c', focusColor='#62646b', size=25})=>{
    const [focuse, setFocus]= useState(false);
    return(
        <svg xmlns="http://www.w3.org/2000/svg" 
            height={`${size}px`}  
            viewBox="0 -960 960 960" 
            width={`${size}px`}  
            fill={focuse? focusColor : color}
                    onMouseEnter={()=>setFocus(true)}
                    onMouseLeave={()=>setFocus(false)}
            onClick={()=> fn? fn(): null}>
            <path d="M360-120v-720h80v720h-80Zm160-160v-400l200 200-200 200Z"/>
        </svg>
    )
}
const EditeProfile = ({fn = null, color ='#27282c', focusColor='#62646b', size=25})=>{
    const [focuse, setFocus]= useState(false);
    return(
        <svg xmlns="http://www.w3.org/2000/svg" 
            height={`${size}px`}  
            viewBox="0 -960 960 960" 
            width={`${size}px`}  
            fill={focuse? focusColor : color}
                    onMouseEnter={()=>setFocus(true)}
                    onMouseLeave={()=>setFocus(false)}
            onClick={()=> fn? fn(): null}>
            <path d="M480-240Zm-320 80v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q37 0 73 4.5t72 14.5l-67 68q-20-3-39-5t-39-2q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32h240v80H160Zm400 40v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T903-340L683-120H560Zm300-263-37-37 37 37ZM620-180h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19ZM367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47Zm169.5-56.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Z"
/>
        </svg>
    )  
}
const BlockeIcon = ({fn = null, color ='#27282c', focusColor='#62646b', size=25}) =>{
    const [focuse, setFocus]= useState(false);
    return(
        <svg xmlns="http://www.w3.org/2000/svg" 
            height={`${size}px`}  
            viewBox="0 -960 960 960" 
            width={`${size}px`}  
            fill={focuse? focusColor : color}
                    onMouseEnter={()=>setFocus(true)}
                    onMouseLeave={()=>setFocus(false)}
            onClick={()=> fn? fn(): null}>
            <path d="M324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5ZM480-160q54 0 104-17.5t92-50.5L228-676q-33 42-50.5 92T160-480q0 134 93 227t227 93Zm252-124q33-42 50.5-92T800-480q0-134-93-227t-227-93q-54 0-104 17.5T284-732l448 448ZM480-480Z"/>
        </svg>
    )
}
const ReplyTo = ({fn = null, color ='#27282c', focusColor='#62646b', size=25})=>{
    const [focuse, setFocus] = useState(false);
    return(
        <svg xmlns="http://www.w3.org/2000/svg" 
            height={`${size}px`} 
            viewBox="0 -960 960 960" 
            width={`${size}px`} 
            fill={focuse? focusColor : color}
                    onMouseEnter={()=>setFocus(true)}
                    onMouseLeave={()=>setFocus(false)}
            onClick={()=> fn? fn(): null}>
            <path d="m600-200-56-57 143-143H300q-75 0-127.5-52.5T120-580q0-75 52.5-127.5T300-760h20v80h-20q-42 0-71 29t-29 71q0 42 29 71t71 29h387L544-624l56-56 240 240-240 240Z"/>
        </svg>
    )
}
const EditMessage =({fn = null, color ='#27282c', focusColor='#62646b', size=25})=>{
    const [focuse, setFocus]= useState(false);
    return(
        <svg xmlns="http://www.w3.org/2000/svg" 
            height={`${size}px`} 
            viewBox="0 -960 960 960" 
            width={`${size}px`} 
            fill={focuse? focusColor : color}
                    onMouseEnter={()=>setFocus(true)}
                    onMouseLeave={()=>setFocus(false)}
            onClick={()=> fn? fn(): null}
        >
            <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
        </svg>
    )
}
const DeletetIcon = ({fn = null, color ='#27282c', focusColor='#62646b', size=25})=>{
    const [focuse, setFocus]= useState(false);
    return(
        <svg xmlns="http://www.w3.org/2000/svg" 
            height={`${size}px`}
            viewBox="0 -960 960 960" 
            width={`${size}px`}
            fill={focuse? focusColor : color}
                    onMouseEnter={()=>setFocus(true)}
                    onMouseLeave={()=>setFocus(false)}
            onClick={()=> fn? fn(): null}
            ><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
        </svg>
    )
}
const Logout =({fn = null, color ='#27282c', focusColor='#62646b', size=25})=>{
    const [focuse, setFocus]= useState(false);
    return(
        <svg xmlns="http://www.w3.org/2000/svg" 
            height={`${size}px`}
            viewBox="0 -960 960 960" 
            width={`${size}px`}
            fill={focuse? focusColor : color}
                    onMouseEnter={()=>setFocus(true)}
                    onMouseLeave={()=>setFocus(false)}
            onClick={()=> fn? fn(): null}
            ><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
        </svg>
    )
}
const PlusIcon =({fn = null, color ='#27282c', focusColor='#62646b', size=25})=>{
    const [focuse, setFocus]= useState(false);
    return(
        <svg xmlns="http://www.w3.org/2000/svg" 
            height={`${size}px`}
            viewBox="0 -960 960 960" 
            width={`${size}px`} 
            fill={focuse? focusColor : color}
                    onMouseEnter={()=>setFocus(true)}
                    onMouseLeave={()=>setFocus(false)}
            onClick={()=> fn? fn(): null}
            >
                <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
        </svg>
    )
}
const ShieldIcon =({fn = null, color ='#27282c', focusColor='#62646b', size=25})=>{
    const [focuse, setFocus]= useState(false);
    return(
        <svg xmlns="http://www.w3.org/2000/svg" 
            height={`${size}px`} 
            viewBox="0 -960 960 960" 
            width={`${size}px`}
            fill={focuse? focusColor : color}
                    onMouseEnter={()=>setFocus(true)}
                    onMouseLeave={()=>setFocus(false)}
            onClick={()=> fn? fn(): null}
            >
                <path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z"/>
        </svg>
    )
}
const Settings  =({fn = null, color ='#27282c', focusColor='#62646b', size=25})=>{
    const [focuse, setFocus]= useState(false);
    return(
        <svg xmlns="http://www.w3.org/2000/svg" 
            height={`${size}px`} 
            viewBox="0 -960 960 960" 
            width={`${size}px`}
            fill={focuse? focusColor : color}
                    onMouseEnter={()=>setFocus(true)}
                    onMouseLeave={()=>setFocus(false)}
            onClick={()=> fn? fn(): null}
            >
                <path d="m620-284 56-56q6-6 6-14t-6-14L540-505q4-11 6-22t2-25q0-57-40.5-97.5T410-690q-17 0-34 4.5T343-673l94 94-56 56-94-94q-8 16-12.5 33t-4.5 34q0 57 40.5 97.5T408-412q13 0 24.5-2t22.5-6l137 136q6 6 14 6t14-6ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
        </svg>
    )
}
export{
    LogoIcon,
    UserIcon,
    SendIcon,
    SearchIcon,
    FriendsIcon,
    GroupIcon,
    ReplyIcon,
    LeftArrow,
    RightArrow,
    EditeProfile,
    BlockeIcon,
    ReplyTo,
    EditMessage,
    DeletetIcon,
    PlusIcon,
    ShieldIcon,
    Logout,
    Settings
    
}