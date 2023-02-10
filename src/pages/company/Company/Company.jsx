import { Fragment, useEffect, useState } from 'react'
import './Company.scss'
import { proxy } from '../../../api/proxy'
import { API_USERLIST } from '../../../api/api'

import { useCookies } from "react-cookie"
import { AddUser } from './components/addUser'
import axios from 'axios'

export const CompanyComponent = () =>{

    const [cookies, setCookie] = useCookies(['token']);

    const [userList, setUserList] = useState([]);
    const [isAddAccount, setIsAddAccount] = useState(false);

    useEffect(() =>{

        // proxy(API_USERLIST, "GET", {
        //     'Authorization': cookies.token
        //   })
          axios.get(API_USERLIST,{
            headers: {
              'Authorization': cookies.token
            },
          })
          .then(res => {
            console.log(res.data.results)
            setUserList(res.data.results)
        })
    },[])

    return(
        <div className='company'>
            <h2>Company</h2>
            <div className='company__name'>
                <h3>Taqtile</h3>
            </div>
            <div className='company__accounts_tab'>
                <h2>Accounts</h2>
                <button className='company__add' onClick={() => setIsAddAccount(true)}>+ Add Account</button>
            </div>

            <div className='company__accounts_container'>
                {userList.map((user) => 
                <Fragment key={user.id}>
                    <div className='company__user'>
                        <span>{user.username}</span>
                        {user.id === 1 ?
                        <div className='company__user_owner'>Owner</div>
                        :
                        <div className='company__user_worker'>Worker</div>
                        }
                        
                    </div>
                </Fragment>
                )}
            </div>
            {isAddAccount && <AddUser close={() =>{setIsAddAccount(false)}}/>}
        </div>
    )
}