/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react"
import { ReportPage } from "../../Reports/ReportsPage"
import {  getProcess } from "../../../api/algorithmRequest"
import { useCookies } from "react-cookie"

import './algorithmPage.scss'
import { CameraModal } from "./modal/selectCamera"

export const AlgorithmPage = () => {
    const control = window.location.pathname.split("/")[2]
    const [cookies] = useCookies(['token'])
    const [camera, setCamera] = useState(false)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        if (!showModal){
            getProcess(window.location.hostname, cookies.token).then(e=> {
                console.log('update data')
                setCamera(e.data.filter(cam => cam.algorithm.name === control))
            })
        }
      
    },[showModal])

    return (
        <>
            <ReportPage control={control} />
            {
             camera && 
             <div className="cameras-list">
                <h1>
                    <span>Cameras</span>
                    <button onClick={() => setShowModal(true)}>Manage Cameras</button>
                </h1>
                {
                    camera.map((item, index) => {
                        return (
                            <Fragment key={index}>
                                <div className="cameras-list__item">
                                    {item.camera.name}
                                </div>
                            </Fragment>
                        )
                    }) 
                }
                {
                showModal && <CameraModal 
                    token={cookies.token} 
                    activeCameras = {camera.map(item => item.camera.id)}
                    setShowModal = {() => setShowModal(false)}
                    fullInfoProcess = {camera}
                    control = {control}
                />
                }
            </div>
            
           }
        </>
    )
}