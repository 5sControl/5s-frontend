import { useState } from 'react'
import { API_REGISTRATION } from '../../../../api/api'
import './addUser.scss'
import axios from 'axios'
import { proxyPOST } from '../../../../api/proxy'
export const AddUser = ({close}) =>{
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const registration = () =>{
        
//////////////////////////////////////////////////////////////////////CHANGE/////////////////////////////////////////////////////////////////////////////////////////////////////////

        // axios.post("https://5scontrol.pl/proxy_to_ngrok",{
        //     url: API_REGISTRATION,
        //     method:"POST",
        //     headers:{
        //       "Content-Type": "application/json"
        //     },
        //     body:JSON.stringify({
        //       username: email,
        //       password: password,
        //       repeat_password: password
        //     })
        // })
        proxyPOST(API_REGISTRATION, {
            username: email,
              password: password,
              repeat_password: password
          })
        .then(res => {
            console.log(res)
            if(res.data.message === "User has been successfully created"){
                close()
            }
            
        })
    }
    
    return(
        <div className="add-user">
           <div className='add-user__container'>
                <h3>Adding account</h3>
                <h5>Email</h5>
                <label>Set email that will be used to log in.</label>
                <input 
                    className='add-user__input'
                    type="text" 
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <h5>Password</h5>
                <label>Set password that will be used to log in.</label>
                <input 
                    className='add-user__input'
                    type="password" 
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <h5>Role</h5>
                <label>Select a role of the account. Not today.</label>
                <h3>Worker</h3>
                <div className='add-user__footer'>
                    <button className='add-user__button_cancel' onClick={close}>Cancel</button>
                    <button className='add-user__button_create' onClick={registration}>Create</button>
                </div>
           </div>
        </div>
    )
}