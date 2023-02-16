/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import './main.scss'
import logo from '../../assets/svg/icon.svg'
import { Fragment, useEffect, useState } from 'react'
import { getIsInternet } from '../../functions/getURL'
import { API_ALGORITHM_I, API_ALGORITHM, API_POSTALGORITHM_I, API_POSTALGORITHM, API_CAMERA } from '../../api/api'
import { proxyPOST } from '../../api/proxy'

import { useNavigate } from 'react-router-dom'

import close from '../../assets/svg/close.svg'
import camera from '../../assets/png/camera.png'

import cam160 from '../../assets/jpg/160.jpeg'
import cam161 from '../../assets/jpg/161.jpeg'
import cam162 from '../../assets/jpg/162.jpeg'

import axios from 'axios';
import { proxy } from '../../api/proxy'
import { useCookies } from 'react-cookie'
import { AlgorithmList } from '../../components/algorithmList'

export const Main = () =>{
    const [camerasSafety_Control_Ear_protection, setCamerasSafety_Control_Ear_protection] = useState([])
    const [camerasTool_control, setCamerasTool_control] = useState([])
    const [camerasStaff_control, setCamerasStaff_control] = useState([])
    // console.log(window.location.host)
    const [stage, setStage] = useState('begin')
    const [selectType, setSelectType] = useState('')
    const [cookies, setCookie] = useCookies(['token'])
    const [algorithmList, setAlgorithmList] = useState({})
    const [showAfterRegistration, setShowAfterRegistration] = useState(false)
    const navigate = useNavigate()
    const reducer = () => { 
        return      camerasTool_control.filter(el=>el.isSelected).map(e=>e.ip).length +
                    camerasSafety_Control_Ear_protection.filter(el=>el.isSelected).map(e=>e.ip).length +
                    camerasStaff_control.filter(el=>el.isSelected).map(e=>e.ip).length
    }
    
    const [algorithmCount, setAlgorithmCount] = useState(reducer())
    useEffect(() => {
        setAlgorithmCount(reducer())
    })
    const continueHandler = () =>{
        let response = {
            // Safety_Control_Reflective_jacket:null,
            // Safety_Control_Hand_protection:null,
            // Safety_Control_Head_protection:null,       
            // Idle_control:null,   
        }
        
        if (camerasSafety_Control_Ear_protection.filter(el=>el.isSelected).map(e=>e.ip).length > 0 ){
            response.Safety_Control_Ear_protection = camerasSafety_Control_Ear_protection.filter(el=>el.isSelected).map(e=>e.ip)
        }
        if (camerasStaff_control.filter(el=>el.isSelected).map(e=>e.ip).length > 0 ){
            response.Staff_Control = camerasStaff_control.filter(el=>el.isSelected).map(e=>e.ip)
        }
        if (camerasTool_control.filter(el=>el.isSelected).map(e=>e.ip).length > 0 ){
            response.Tool_control = camerasTool_control.filter(el=>el.isSelected).map(e=>e.ip)
        }

        if (getIsInternet(window.location.host)){
            axios.post("https://5scontrol.pl/proxy_to_ngrok",{
                url: API_POSTALGORITHM_I,
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    'Authorization': cookies.token
                  },
                body:JSON.stringify( response )
            })
            .then((e) => {
                if (e.data.message === "Camera Algorithm records created successfully"){
                    setShowAfterRegistration(e.data.message)
                    localStorage.setItem('registration', 'true')
                }})
        }
        else{
            proxyPOST(`http://${window.location.hostname}${API_POSTALGORITHM}`,response )
                .then((e) => {
                    if (e.data.message === "Camera Algorithm records created successfully"){
                        setShowAfterRegistration(e.data.message)
                        localStorage.setItem('registration', 'true')
                    }})
        }

    }

    const doneHandler = () =>{
        if (selectType.type === 'camerasSafety_Control_Ear_protection'){
            setCamerasSafety_Control_Ear_protection(selectType.obj)
        }
        if (selectType.type === 'camerasStaff_control'){
            setCamerasStaff_control(selectType.obj)
        }
        if (selectType.type === 'camerasTool_control'){
            setCamerasTool_control(selectType.obj)
        }
        setSelectType('')
    }
    useEffect(() => {
        // axios.get(`http://192.168.1.101${API_CAMERA}`)
        
        if (getIsInternet(window.location.host)){
            let buf = new Array(5).fill(4).map((el, ind)=>{return{
                id:ind + 1,
                isSelected:false,
                ip:ind === 1 ? '192.168.1.160':'192.168.1.161'
              }})
    
              setCamerasSafety_Control_Ear_protection(buf)
              setCamerasTool_control(buf)
              setCamerasStaff_control(buf)
        } 
        else{
            axios.get(`http://${window.location.hostname}${API_CAMERA}`)
                .then(response => {
                    let buf = response.map((el, ind)=>{return{
                        id:ind + 1,
                        isSelected:false,
                        ip:ind === response.data.ip
                      }})
                setCamerasSafety_Control_Ear_protection(buf)
                setCamerasTool_control(buf)
                setCamerasStaff_control(buf)
            })
        }
     
        if (getIsInternet(window.location.host)){
            proxy(API_ALGORITHM_I, "GET", {
                'Authorization': cookies.token
              })
              .then(res => {
                setAlgorithmList(res.data)
                console.log(res.data)
            })
           }
           else{
            axios.get(`http://${window.location.hostname}${API_ALGORITHM}`,{
                    headers: {
                    'Authorization': cookies.token
                    },
                })
                .then(res => {
                    console.log(res.data.results)
                })
           }

    },[])
    

    const onChangeHandler = (id) => {
        console.log(selectType)
        setSelectType( {
            obj:selectType.obj.map(el => el.id === id ? {...el, isSelected:!el.isSelected} :el ),
            type:selectType.type
        })
    }
    
    return (
        <>
        {localStorage.getItem('registration') === 'true' ? 
         <div className='showAfterRegistration'>
         <div className='showAfterRegistration__container'>
             <h4>You alredy registrated</h4>
             <button className='showAfterRegistration__button' onClick={() => navigate('/dashboard')}>Dashboard</button>
         </div>
     </div>
        :
        <>
         {
         stage ==='begin' &&
             <div className='main'>
                 <img src={logo} alt='logo' className='main__logo'/>
                 <span className='main__span'>
                     Congratulations! <br/>You have successfully installed the 5S Control’s Docker and now ready to use it. Complete the setup to start.
                 </span>
                 <button className='main__start' onClick={() => setStage('algorithm')}>
                     Start Setup
                 </button>
             </div>
         } 
         {
         stage ==='algorithm' &&
            <AlgorithmList 
                algorithmList={algorithmList} 
                algorithmCount={algorithmCount}
                setSelectType = {(e)=>{setSelectType(e)}}
                camerasSafety_Control_Ear_protection = {camerasSafety_Control_Ear_protection}
                camerasStaff_control = {camerasStaff_control}
                camerasTool_control = {camerasTool_control}
                algorithmPage={'main'}
            />
         }  
         <div className={stage!=='begin' ? 'visible' : 'novisible'}>
             <button 
              className={algorithmCount === 0 || algorithmCount > 5? 'noclick':''}
             onClick={continueHandler}>Continue</button>
         </div> 
         {
         selectType !== '' &&
             <>
                 <div className='select'>
                     <div className='select__container'>
                         <div className='select__header'>
                             <h1>Select up to 5 more cameras to use</h1>
                             <img src={close} alt='Close' onClick={() => setSelectType('')}/>
                         </div>
                         <div className='select__cameras'>
                             {
                                 selectType.obj.map((el,ind) =>
                                     <Fragment key={el.id}>
                                         <div className={el.ip.includes('.') ? 'select__cameras_item' :'select__cameras_noitem' }>
                                             <img src={el.ip.includes('160')? cam160 :
                                                       el.ip.includes('161')? cam161 : 
                                                       el.ip.includes('162')? cam162 : 
                                                       camera} alt='Camera'/>
                                             <div className='select__cameras_item_footer'>
                                                 <span>{el.ip}</span>
                                                 <input type='checkbox'
                                                     checked={el.isSelected}
                                                      onChange={()=>onChangeHandler(el.id)}
                                                     />
                                             </div>
                                            
                                         </div>
                                     </Fragment>)
                             }
                         </div>
                         <div className='select__buttons'>
                             <button className='select__buttons_cancel' onClick={() => setSelectType('')}>Cancel</button>
                             <button className='select__buttons_done' onClick={doneHandler}>Done</button>
                         </div>
                     </div>
                 </div>
             </>
         }
         {
             showAfterRegistration && 
             <div className='showAfterRegistration'>
                 <div className='showAfterRegistration__container'>
                     <h4>{showAfterRegistration}</h4>
                     <button className='showAfterRegistration__button' onClick={() => navigate('/dashboard')}>Close</button>
                 </div>
             </div>
         }
         </>
        }
        </>
       
    )
}