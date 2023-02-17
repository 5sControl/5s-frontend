import {AiOutlineRight } from "react-icons/ai";
import axios from 'axios'
import { useEffect, useState } from 'react'
import './cameras.scss'
import { Close } from "../assets/svg/SVGcomponent";
import { useCookies } from "react-cookie";

export const Cameras = () => {

    const [cookies, setCookie] = useCookies(['token']);
    const [camerasList, setCamerasList] = useState(false)
    const [isShowModal, setIsShowModal] = useState(false)
    const [stage, setStage] = useState('selectCamera')
    const [IPCamera, setIPCamera] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [createdCameras, setCreatedCameras] = useState([])

    useEffect(() => {
        
        axios.get(`http://${window.location.hostname}:8008/find_cameras/`)
            .then(response => {setCamerasList(response.data.results)})
        axios.get(`http://${window.location.hostname}/api/staff_control/locations/camera/`,{
            headers: {
            'Authorization': cookies.token
            },
        })
            .then(response => {
                setCreatedCameras(response.data.results)
            })
    },[])

    const showAddCameras = () => {
        setIsShowModal(true)
    }
    const connect = () => {
        
        axios.post(`http://${window.location.hostname}/api/staff_control/locations/post_camera/`,{
                ip: IPCamera,
                username: username,
                password: password,
                url: `http://${window.location.hostname}:8008/`
        },{
            headers: {
                'Authorization': cookies.token
                },
        }).then((e)=>
        {
            console.log(e)
            setStage('selectCamera')
            setIPCamera('')
            setPassword('')
            setIsShowModal(false)
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
                                        />
                                    <label>Password</label>
                                    <input 
                                        type='password' 
                                        placeholder='Password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <div className='cameras__modal__login__footer'>
                                        <button className='cameras__modal__login__cancel' onClick={() => setStage('selectCamera')}>Cancel</button>
                                        <button className="cameras__modal__login__create" onClick={connect}>Connect</button>
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