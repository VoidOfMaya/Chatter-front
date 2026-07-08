import { useState } from 'react'
import style from './dialogs.module.css'
import { useOutletContext, useNavigate } from 'react-router-dom';
import { notify } from '../norifications/notifications';
const LoginDialog = ({referance, close})=>{

    const{onLoginSuccess,callApi} = useOutletContext();
    
    const [data, setData] = useState({
        email: '',
        password: ''
    })
    const handleSubmit = async (e) =>{
        try{
            const response = await callApi({
                method: 'POST',
                path: 'auth/login',
                requiresAuth: false,
                body:{
                    email: data.email,
                    password: data.password
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
    return(
        <dialog ref={referance}>
            <div style={{gridArea:'title', justifySelf: 'center'}}>Log In</div>
            <form 
                    style={{gridArea:'form'}}  
                    className={style.loginForm}
                    onSubmit={(e)=> {
                        e.preventDefault();

                        handleSubmit(e);
                        referance.current.close();
                        close()
                    }}
                    >
                <label htmlFor='email'>Email: </label>
                <input  type='email' 
                        id='email' 
                        name='email' 
                        placeholder="example@example.com" 
                        required
                        onChange={(e) =>
                            setData((prev)=>({
                                ...prev,email : e.target.value
                            }))
                        }
                ></input>

                <label htmlFor='password'>Password: </label>
                <input  
                        type='password' 
                        id='password'
                        name='password' 
                        placeholder="********" 
                        min='8' 
                        required
                        onChange={(e) =>
                            setData((prev)=>({
                                ...prev,password : e.target.value
                            }))
                        }
                ></input>

                <button type='button'
                    onClick={()=>{
                        referance.current.close();
                        close()
                    }}
                >Cancel</button>
                <button type='submit'>
                    Login
                </button>
            </form>
        </dialog>
    )
}

const SignupDialog = ({referance, close}) =>{

    const {callApi} = useOutletContext();

    const [data, setData]= useState({
        name: '',
        email: '',
        password: '',
        confirmPassword:''
    })
    const handleSubmit = async(e) =>{
        e.preventDefault();
        try{
            const response = await callApi({
                method: 'POST',
                path: 'auth/register',
                requiresAuth: false,
                body:{
                    email: data.email,
                    name: data.name,
                    password: data.password,
                    confirmPassword: data.confirmPassword
                },
            })
            if(!response.ok) throw new Error(response.msg);
            notify.success('User registered')
            close()                            
        }catch(err){
            console.error(err.message)
        }
 
    }
    return(
        <dialog ref={referance}>
            <div style={{gridArea:'title', justifySelf: 'center'}}>Signup</div>

            <form   action='http://localhost:3000/auth/register' method='POST'
                    style={{gridArea:'form'}} 
                    className={style.signupForm}
                    onSubmit={async (e)=> handleSubmit(e)}>
                <label htmlFor='email'>Email :</label>
                <input  type='email' id='email' name='email' placeholder="email" required 
                    value={data.email}
                onChange={(e)=>
                    setData((prev)=>({
                        ...prev, email: e.target.value,
                    }))
                }
                ></input>

                <label htmlFor='name'>First name :</label>
                <input  type='' id='name' name='name' placeholder="name" minLength='3'maxLength='12' required
                value={data.name}
                onChange={(e)=>
                    setData((prev)=>({
                        ...prev, name: e.target.value,
                    }))
                }
                ></input>

                <label htmlFor='password'>Password :</label>
                <input  type='password' id='password' name='password' placeholder="password" minLength='8' required

                        value={data.password}
                        onChange={(e)=>
                            setData((prev)=>({
                                ...prev, 
                                password: e.target.value,
                            }))
                        }
                        className={ data.password !== data.confirmPassword? style.invalidField : style.validField}
                ></input>

                <label htmlFor='confirmPass'>Confirm password :</label>
                <input  type='password' id='confirmPass'name='confirmPass'
                        placeholder="Confirm password"minLength='8'required

                        value={data.confirmPassword}
                        onChange={(e)=>setData(prev=>({...prev, confirmPassword: e.target.value}))}
                        className={ data.password !== data.confirmPassword? style.invalidField : style.validField}
                ></input>
                
                <button type='button'
                    onClick={(e)=>{
                        referance.current.close();
                        close()
                    }}
                >Cancel</button>
                <button type='submit'>
                    Signup
                </button>
            </form>
        </dialog>          
    )
}

const NewGroupDialog =  ({referance, close, auth, reAuth, updateApp})=>{
    const [name, setName] = useState('');
      //creates new channel
    const createNewGroup = async(name) =>{
        try{/*
            const response = await fetch(`${import.meta.env.VITE_API_URL}/channel/321/new`,{
                method: 'POST',
                headers:{
                "Content-Type": 'Application/json',
                "Authorization": `Bearer ${auth.accessToken}`,
              },
                body: JSON.stringify({
                    name : name.name,
                })
            })
            await reAuth(response);*/
            const response = await callApi({
                method: 'POST',
                path: 'channel/321/new',
                requiresAuth: true,
                body:{
                    name: name.name,
                },
            })
              const result = await response.json();
              if(!response.ok) throw new Error(`${result.msg}`)
              notify.success('Group created')
              updateApp()
          }catch(err){
              notify.error(err)
          }
      }
    return(
        <dialog ref={referance} className={style.newGroup}>
            <div style={{gridArea:'title', justifySelf: 'center'}}>
                Create New Group
            </div>
            <form 
                    style={{gridArea:'form'}}  
                    className={style.groupForm}
                    onSubmit={async (e)=> {
                        e.preventDefault();

                        await createNewGroup(name);
                        referance.current.close();
                        close()
                    }}
                    >
                <label htmlFor='name'>Group Name: </label>
                <input  
                    style={{
                        padding: '10px 0px 10px 0px'
                    }}
                        type='text' 
                        id='name' 
                        name='name' 
                        placeholder="group name" 
                        required
                        onChange={(e) =>
                            setName((prev)=>({
                                ...prev,name : e.target.value
                            }))
                        }
                ></input>
                <button style={{padding: '10px'}}>
                   Create
                </button>

                <button
                    style={{
                        padding: '10px 0px 10px 0px',
                        backgroundColor: '#171717'
                    }} 
                    type='button'
                    onClick={()=>{
                        referance.current.close();
                        close()
                    }}
                >Cancel</button>
            </form>
        </dialog>
    )
}

export{
    LoginDialog,
    SignupDialog,
    NewGroupDialog
}