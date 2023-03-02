/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import moment from 'moment'
import { useCookies } from "react-cookie"

import { getCompanyInfo, getUserList } from '../../../api/companyRequest'

import { AddUser } from './components/addUser'
import {LicenseKey} from './components/licenseKey'
import {UserList} from './components/UserList'
import { AvailableProcess } from './components/availableProcess'

import './Company.scss'

export const CompanyComponent = () =>{

    const [cookies] = useCookies(['token'])
    const [userList, setUserList] = useState([]);
    const [isAddAccount, setIsAddAccount] = useState(false);
    const [companyInfo, setCompanyInfo] = useState({});
    
    useEffect(() =>{
        getUserList(window.location.hostname, cookies.token)
          .then(res => {
            if (res.data.detail !=='Authentication credentials were not provided.' && res.data.detail!== 'Given token not valid for any token type') {
                setUserList(res.data.results)
            }
        })
        getCompanyInfo(window.location.hostname, cookies.token)
            .then((response) => {
                setCompanyInfo(response.data)
            })
    },[])

    return(
    <>
        {userList.length > 0 && 
        <div className='company'>
            <h2>Company</h2>
            <div className='company__name'>
                <h3>{companyInfo.name_company}</h3>
                <br></br>
                <h4>Date joined: {moment(companyInfo.date_joined).format("DD-MM-YYYY")}</h4>
                <h4>Days left: {companyInfo.days_left}</h4>
                <h4>Cameras count: {companyInfo.count_cameras}</h4>
                <h4>Active neurons: {companyInfo.neurons_active}</h4>
                
            </div>
            <LicenseKey cookies= {cookies.token}/>
            <AvailableProcess />
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