/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { API_REGISTRATION, API_REGISTRATION_I } from '../../../../api/api'
import './addUser.scss'
import axios from 'axios'
import { proxyPOST } from '../../../../api/proxy'
import { getIsInternet } from '../../../../api/getURL'
export const AddUser = ({close}) =>{
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const registration = () =>{
        
        if (getIsInternet(window.location.host)){
            axios.post("https://5scontrol.pl/proxy_to_ngrok",{
                url: API_REGISTRATION_I,
                method:"POST",
                headers:{
                  "Content-Type": "application/json"
                },
                body:JSON.stringify({
                  username: email,
                  password: password,
                  repeat_password: password
                })
            })
                .then(res => {
                    console.log(res)
                    if(res.data.message === "User has been successfully created"){
                        close()
                    }
                })
        }
        else{
            proxyPOST(`http://${window.location.hostname}${API_REGISTRATION}`, {
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
                    <button className='add-user__cancel' onClick={close}>Cancel</button>
                    <button className='add-user__create' onClick={registration}>Create</button>
                </div>
           </div>
        </div>
    )
}