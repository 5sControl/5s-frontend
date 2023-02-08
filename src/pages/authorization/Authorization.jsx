import './Authorization.scss'

import logo from '../../assets/svg/icon.svg'
import { useEffect, useState } from 'react'

export const Authorization = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [correctEmail, setCorrectEmail] = useState(false)
    const [correctPassword, setCorrectPassword] = useState(false)

    // const validate = (text) => {
    //     let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    //     if (reg.test(text) === false) {
    //       setCorrectEmail(false)
    //       setEmail(text)
    //       return false;
    //     }
    //     else {
    //       setEmail(text)
    //       setCorrectEmail(true)
    //     }
    //   }

      useEffect(()=>{
        if (password.length > 4 && password.length < 20){
            setCorrectPassword(true)
        }else{
            setCorrectPassword(false)
        }
      },[password])

      useEffect(()=>{
        if (email.length > 4 && email.length < 20){
            setCorrectEmail(true)
        }else{
            setCorrectEmail(false)
        }
      },[email])

   return (
    <div className="authorization">
        <img src={logo} alt='logo' className='authorization__logo'/>
        <h2 className='authorization__title'>Sign in to 5S Control</h2>
        <div className='authorization__container'>
            <label>Email</label>
            <input 
                type='text' 
                placeholder='Enter Email' 
                className='authorization__input'
                value={email} 
                onChange={(e)=>setEmail(e.target.value)}
            />
            {!correctEmail && <span className='authorization__error'>Email isn't correct!</span>}
            <label>Password</label>
            <input 
                type='password' 
                className='authorization__input' 
                placeholder='Enter Password'
                value={password} 
                onChange={(e)=>setPassword(e.target.value)}
            />
            {!correctPassword && <span className='authorization__error'>This field is required</span>}
            <button className='authorization__button' onClick={()=>console.log({email:email, password:password})}>Log In</button>
        </div>

    </div>
   ) 
}