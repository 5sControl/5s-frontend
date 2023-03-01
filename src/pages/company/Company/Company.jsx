/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Fragment, useEffect, useState } from 'react'
import './Company.scss'

import { useCookies } from "react-cookie"
import { AddUser } from './components/addUser'
import { getUserList } from '../../../api/requests'
import { getCompanyInfo } from '../../../api/requestCompany'
import {LicenseKey} from './components/licenseKey'
import {UserList} from './components/UserList'
export const CompanyComponent = () =>{

    const [cookies, setCookie, removeCookie] = useCookies(['token'])
    const [userList, setUserList] = useState([]);
    const [isAddAccount, setIsAddAccount] = useState(false);


    useEffect(() =>{
        getUserList(window.location.hostname, cookies.token)
          .then(res => {
            if (res.data.detail !=='Authentication credentials were not provided.' && res.data.detail!== 'Given token not valid for any token type') {
                setUserList(res.data.results)
            }
            else{
                removeCookie('token')
            }
        })
        getCompanyInfo(window.location.hostname, cookies.token)
            .then((data) => {
                console.log(data)
            })
    },[])

    return(
    <>
        {userList.length > 0 && 
        <div className='company'>
            <h2>Company</h2>
            <div className='company__name'>
                <h3>Taqtile</h3>
            </div>
            <LicenseKey/>
            <div className='company__accounts_tab'>
                <h2>Accounts</h2>
                <button className='company__add' onClick={() => setIsAddAccount(true)}>+ Add Account</button>
            </div>
            <UserList userList={userList}/>
            {isAddAccount && <AddUser close={() =>{setIsAddAccount(false)}}/>}
        </div> 
        }
    </>
    )
}