/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios'
import { useEffect, useState } from 'react'

import { useCookies } from "react-cookie";
import { CamerasModal } from './modal/camerasModal';

import './cameras.scss'
export const Cameras = () => {

    const [cookies, setCookie] = useCookies(['token']);
    const [camerasList, setCamerasList] = useState(false)
    const [isShowModal, setIsShowModal] = useState(false)
    const [createdCameras, setCreatedCameras] = useState(false)
    
    const [error, setError] = useState(false)
    

    useEffect(() => {
        
        if (window.location.hostname.includes('localhost')) {

        axios.get(`http://192.168.1.101:8008/find_cameras/`)
            .then(response => {
                setCamerasList(response.data.results)
                console.log(response.data.results)
            })
            .catch((error)=>setError(error.message))

        axios.get(`http://192.168.1.101/api/cameras/`,{
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
        axios.get(`http://${window.location.hostname}/api/cameras/`,{
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

    return (
        <section className="cameras">
            <div className='cameras__title'>
                <h1>Cameras</h1>
                <button className='cameras__button' onClick={showAddCameras}>+ Add Camera</button>
            </div>
            {
            createdCameras && 
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
                <CamerasModal 
                    setIsShowModal = {(e) => setIsShowModal(e)}
                    cookies = {cookies}
                    camerasList = {camerasList}
                />                 
            }
        </section>
    )
}