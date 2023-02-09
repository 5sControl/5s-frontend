import { Fragment, useEffect, useState } from 'react'
import './Company.scss'
import { proxy } from '../../../api/proxy'
import { API_ADMIN, API_AUTH, API_URL } from '../../../api/api'

import { useCookies } from "react-cookie"
export const CompanyComponent = () =>{

    const [cookies, setCookie] = useCookies(['token']);

    const [userList, setUserList] = useState([]);
    
    useEffect(() =>{
        proxy(API_ADMIN, "GET", {
            'Authorization': cookies.token
          }).then(res => {
            console.log(res.data.results)
            setUserList(res.data.results)
        })
    },[])

    return(
        <div className='company'>
            <h2>Company</h2>
            <div className='company__name'>
                <h3>Company Name</h3>
            </div>
            <div className='company__accounts_tab'>
                <h2>Accounts</h2>
                <button>+ Add Account</button>
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
        </div>
    )
}