import axios from 'axios'
import { useState } from 'react'
import './cameras.scss'

export const Cameras = () => {

    const [camerasList, setCamerasList] = useState(false)
    const showAddCameras = () => {

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
                {
                    camerasList.map(el => <div>{el}</div>)
                }
            </div>
            }
        </section>
    )
}