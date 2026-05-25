import { useState } from 'react'
import style from './dialogs.module.css'
import { useOutletContext, useNavigate } from 'react-router-dom';

const LoginDialog = ({referance, close})=>{
    const {onLoginSuccess}= useOutletContext();

    const handleSubmit = (e) =>{
        const formData = new FormData(e.target)
        const email = formData.get("Email");
        const password = formData.get("password");
        onLoginSuccess(email, password);
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
                <label htmlFor='Email'>Email: </label>
                <input type='email' id='Email' name='Email' placeholder="example@example.com" required></input>
                <label htmlFor='password'>Password: </label>
                <input type='password' id='password' name='password' placeholder="********" min='8' required></input>
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
    const [data, setData]= useState({
        name: '',
        email: '',
        password: '',
        confirmPassword:''
    })
    return(
        <dialog ref={referance}>
            <div style={{gridArea:'title', justifySelf: 'center'}}>Signup</div>

            <form   action='http://localhost:3000/auth/register' method='POST'
                    style={{gridArea:'form'}} 
                    className={style.signupForm}
                    onSubmit={async (e)=>{
                        e.preventDefault();
                        //creates the form body to submit to server
                        const registerData = new URLSearchParams();
                        registerData.append('email', data.email);
                        registerData.append('name', data.name);
                        registerData.append('password', data.password);
                        registerData.append('confirmPassword', data.confirmPassword);
                        //submits 
                        try{
                        fetch('http://localhost:3000/auth/register',{
                                method: 'POST',
                                headers:{
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                body:registerData,
                            })
                            .then((response)=>{
                                if(!response.ok) throw new Error(response.msg);
                                return response.json()
                            })
                            .then((data) => {
                                console.log('Success! Data received:', data);
                            })
                            .catch((error) => {
                                console.error('Fetch failed:', error);
                            });

                            referance.current.close()
                            close()                            
                        }catch(err){
                            console.error(err.message)
                        }
 
                    }}>
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

export{
    LoginDialog,
    SignupDialog
}