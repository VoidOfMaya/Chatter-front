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

    if( window.innerWidth < 780){
        return(
            <>
            <main className={style.signupMain}>
                <div style={{
                    color: '#E84545',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    margin: '20px',
                }}>Chatter <LogoIcon size={45} color={'#E84545'}/></div>
                <section className={style.signup}>
                    <div className={style.signupContainer}>
                        <form className={style.loginForm}>
                            <label htmlFor='email'>Email: </label>
                            <input  type='email' id='email' name='email' 
                                    placeholder="example@example.com" required
                                    onChange={(e) =>
                                        setData((prev)=>({
                                            ...prev,email : e.target.value
                                        }))
                                    }
                            ></input>
                            <label htmlFor='password'>Password: </label>
                            <input  
                                type='password' id='password' name='password' 
                                placeholder="********" min='8' required
                                onChange={(e) =>
                                    setData((prev)=>({
                                        ...prev,password : e.target.value
                                    }))
                                }
                            ></input>
                                <button style={{padding: '40px'}} type='button'>
                                    Login
                                </button>
                            </form>
                    </div>

                    <h4 style={{color:'#E84545', padding: "0px 10px"}}> OR </h4>
                    <div className={style.guest}>
                        <div 
                            className={style.guestBtn}
                            onClick={()=>{
                                handleGuestLogin();
                                }}
                        > Continue as Guest 
                            <UserIcon color='#fff' focusColor='#fff' size={48} />
                        </div>
                    </div>
                </section>

            </main>
            </>
        )
    }else{
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
}

export{
    Signup
}