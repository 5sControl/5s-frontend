/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {AiOutlineRight } from "react-icons/ai";
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Close } from "../../assets/svg/SVGcomponent";
import { useCookies } from "react-cookie";

import './cameras.scss'
import { patchCamera, postCamera } from "../../api/requestHomeAndOffice";
export const Cameras = () => {

    const [cookies, setCookie] = useCookies(['token']);
    const [camerasList, setCamerasList] = useState(false)
    const [isShowModal, setIsShowModal] = useState(false)
    const [stage, setStage] = useState('selectCamera')
    const [IPCamera, setIPCamera] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [createdCameras, setCreatedCameras] = useState([])
    const [connectMessage, setConnectMessage] = useState('')
    const [error, setError] = useState(false)
    const [cameraName, setCameraName] = useState('')

    useEffect(() => {
        
        if (window.location.hostname.includes('localhost')) {

        axios.get(`http://192.168.1.101:8008/find_cameras/`)
            .then(response => {setCamerasList(response.data.results)})
            .catch((error)=>setError(error.message))

        axios.get(`http://192.168.1.101/api/staff_control/locations/camera/`,{
                headers: {
                'Authorization': cookies.token
                },
            })
            .then(response => {
                console.log(response)
                if(response.data.length > 0){
                    setCreatedCameras(response.data)
                }
            })
            .catch((error)=>setError(error.message))
        }
        else{
        axios.get(`http://${window.location.hostname}:8008/find_cameras/`)
                .then(response => {setCamerasList(response.data.results)})
                .catch((error)=>setError(error.message))
        axios.get(`http://${window.location.hostname}/api/staff_control/locations/camera/`,{
            headers: {
                'Authorization': cookies.token
                },
            })
                .then(response => {
                    console.log(response)
                    if(response.data.length > 0){
                        setCreatedCameras(response.data)
                    }
                })
                .catch((error)=>setError(error.message))
        }
    },[])

    const showAddCameras = () => {
        setIsShowModal(true)
    }

    const changeCameraName = () => {
        setIsShowModal(false)
        setStage('selectCamera') 
        patchCamera(window.location.hostname, IPCamera, cameraName)
            .then((res)=>console.log(res))
    }

    const connect = () => {
    postCamera(window.location.hostname , IPCamera, username, password, cookies.token )
       .then((e)=>
            {   
                console.log(e.data)
                localStorage.setItem(e.data.ip, e.data.snapshot)
                if (!e.data.message.includes('failed')){
                    setStage('cameraCreated')
                }else{
                    console.log(e.data.message)
                    setConnectMessage(e.data.message)
                }
            })
    }

    return (
        <section className="cameras">
            <div className='cameras__title'>
                <h1>Cameras</h1>
                <button className='cameras__button' onClick={showAddCameras}>+ Add Camera</button>
            </div>
            {
            camerasList && 
            <div className='cameras__list'>
                {createdCameras.map((el, ind) =>{
                    return(
                        <div key={ind} className="cameras__list_item">
                            <span>IP: {el.id}</span>
                        </div>
                    )
                })}
            </div>
            }
            {error && <div style={{color:'red', fontSize:'26px'}}>{error}</div>}
            {
                isShowModal &&
                    <div className='cameras__modal'>
                        <div className='cameras__modal__container'>
                        { 
                        stage === 'selectCamera' && camerasList.length > 0 && 
                            <>
                            <div className='cameras__modal__title'>
                                <h2>Select a camera from your local network</h2>
                                <Close onClick={() => setIsShowModal(false)} className="cameras__modal__title_close"/>
                            </div>
                            <div className='cameras__modal__list'>
                                {
                                    camerasList.map((el, ind) => 
                                        <div key ={ind} 
                                            className='cameras__modal__list_item' 
                                            onClick={() =>  {setStage('logAndPass'); 
                                            setIPCamera(el)}}
                                        >
                                            <span>{el}</span>
                                            <AiOutlineRight/>
                                        </div>
                                    )
                                }
                            </div>   
                            </>
                        }  
                         { 
                        stage === 'logAndPass' && 
                            <>
                                <div className='cameras__modal__title'>
                                    <h2>{IPCamera}</h2>
                                    <Close onClick={() => setIsShowModal(false)} className="cameras__modal__title_close"/>
                                </div>
                                <div className='cameras__modal__login'>
                                    <label>Username</label>
                                    <input 
                                        type='text' 
                                        placeholder='Username'
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onFocus={() => setConnectMessage('')}
                                        />
                                    <label>Password</label>
                                    <input 
                                        type='password' 
                                        placeholder='Password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setConnectMessage('')}
                                    />
                                    <div style={{color:'red'}}>{connectMessage}</div>
                                    <div className='cameras__modal__login__footer'>
                                        <button className='cameras__modal__login__cancel' onClick={() => setStage('selectCamera')}>Cancel</button>
                                        <button className="cameras__modal__login__create" onClick={connect}>Connect</button>
                                    </div>
                                </div>   
                            </>
                        } 
                         { 
                        stage === 'cameraCreated' && 
                            <>
                                <div className='cameras__modal__showCamera'>
                                    <img src={`data:image/png;base64, ${localStorage.getItem(IPCamera)}`} alt='camera'/>
                                    <input type="text" value={cameraName} onChange={(e) => setCameraName(e.target.value)}/>
                                    <div className='cameras__modal__login__footer'>
                                        <button className="cameras__modal__login__create" onClick={changeCameraName}>Save</button>
                                    </div>
                                </div>   
                            </>
                        } 
                        </div>
                    </div>
            }
        </section>
    )
}