import { useEffect, useRef, useState } from 'react'
import {LogoIcon, SendIcon} from '../iconhelper/iconHelper';
import style from './signup.module.css'
import { LoginDialog, SignupDialog } from '../dialogs/dialogs';
import { useNavigate, useOutletContext } from 'react-router-dom';

const Signup = () =>{
    //context
    const direct= useNavigate();
    const {auth}=useOutletContext();
    //handles dialog displays
    const [login, setLogin]= useState(false);
    const [signup, setSignup]= useState(false);
    const loginRef = useRef(null);
    const signupRef= useRef(null) ; 

    useEffect(()=>{
        if(!login) return
        loginRef.current?.showModal()
        
    },[login])
    useEffect(()=>{
        if(!signup) return
        signupRef.current?.showModal()
        
    },[signup])
    useEffect(()=>{
        if(auth.user) direct('/chatter')
    })

    return(
        <>
            <main className={style.signupMain}>
                <div className={style.signupLeft}>
                    <div onClick={()=>setSignup(true)} className={style.signupBtn}>
                        sign up 
                    </div>
                </div>
                <div className={style.signupRight}>
                    <div className={style.logenElement}>
                        <div onClick={()=>setLogin(true)} className={style.loginBtn}>
                            Log in
                            <div className={style.logoIcon}>
                                <LogoIcon size={50} 
                                    color={'white'} 
                                    focusColor={'#E84545'}/>  
                            </div>
                        </div>                        
                    </div>

                </div>
            </main>
            {login? (
                <LoginDialog referance={loginRef} close={()=>setLogin(false)}/>                
            ):(<></>)}
            {signup? (
                <SignupDialog referance={signupRef} close={()=>setSignup(false)}/>         
            ):(<></>)}
        </>
    )
}

export{
    Signup
}