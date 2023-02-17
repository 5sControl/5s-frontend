import {AiOutlineRight } from "react-icons/ai";
import axios from 'axios'
import { useState } from 'react'
import './cameras.scss'
import { Close } from "../assets/svg/SVGcomponent";

export const Cameras = () => {

    const [camerasList, setCamerasList] = useState(false)
    const [isShowModal, setIsShowModal] = useState(false)
    const [stage, setStage] = useState('selectCamera')
    const [IPCamera, setIPCamera] = useState('')
    const showAddCameras = () => {
        console.log(`http://192.168.1.101:8008/`)
        setIsShowModal(true)
        axios.get('http://192.168.1.101:8008/find_cameras/')
            .then(response => {setCamerasList(response.data.results)})
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
                                        <div key ={ind} className='cameras__modal__list_item' onClick={() =>  {setStage('logAndPass'); setIPCamera(el)}}>
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
                                    <input type='text' placeholder='Username'/>
                                    <label>Password</label>
                                    <input type='password' placeholder='Password'/>
                                    <div className='cameras__modal__login__footer'>
                                        <button className='cameras__modal__login__cancel' onClick={() => setIsShowModal(false)}>Cancel</button>
                                        <button className="cameras__modal__login__create">Connect</button>
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