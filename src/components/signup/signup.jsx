import { useEffect, useRef, useState } from 'react'
import {LogoIcon, UserIcon} from '../iconhelper/iconHelper';
import { notify } from '../norifications/notifications';
import style from './signup.module.css'
import { LoginDialog, SignupDialog} from '../dialogs/dialogs';
import { useNavigate, useOutletContext } from 'react-router-dom';

const Signup = () =>{
    //context
    const direct= useNavigate();
    const {auth, callApi, onLoginSuccess}=useOutletContext();
    //handles dialog displays
    const [login, setLogin]= useState(false);
    const [signup, setSignup]= useState(false);
    const loginRef = useRef(null);
    const signupRef= useRef(null) ; 
    const handleGuestLogin =async()=>{
        try{
            const response = await callApi({
                method: 'POST',
                path: 'auth/login',
                requiresAuth: false,
                includeCred: true,
                body:{
                    email: 'takoyaki@gmail.com',
                    password: '12qwaszx'
                },
            })
            if(!response.ok) throw new Error(`${response.msg}`);
            const {user, accessToken} = await response.json()
            onLoginSuccess(user,accessToken)
            notify.success(`Authentication Successfull!`)
            close()                            
        }catch(err){
            console.error(err.message)
        }
    }

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
                    <div className={style.guest}>
                        <h4 style={{color:'#E84545', padding: "0px 10px"}}> OR </h4>
                        <div 
                        className={style.guestBtn}
                        onClick={()=>{
                            handleGuestLogin();
                        }}
                        > Continue as Guest 
                            <UserIcon color='#fff' focusColor='#fff' size={48} />
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