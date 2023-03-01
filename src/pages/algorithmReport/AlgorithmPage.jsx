/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react"
import { ReportPage } from "../Reports/ReportsPage"
import { deleteProcess, getProcess } from "../../api/requests"
import { useCookies } from "react-cookie"
import { getSelectedCameras } from "../../api/requestHomeAndOffice"

import './algorithmPage.scss'
import { CameraModal } from "./modal/selectCamera"

export const AlgorithmPage = ({control}) => {
    const [cookies] = useCookies(['token'])
    const [camera, setCamera] = useState(false)
    const [showModal, setShowModal] = useState(false)
    getSelectedCameras(window.location.hostname, cookies.token)
    .then((response) => {
      console.log(response);
     
    })
    useEffect(() => {
        getProcess(window.location.hostname, cookies.token).then(e=> {
            setCamera(e.data.filter(cam => cam.algorithm.name === control))
        })
    },[])

    const deleteProcessFromDB = (processID) => {
        deleteProcess(window.location.hostname, cookies.token, processID)
    }

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
                                <div className="cameras-list__item" onClick={() => deleteProcessFromDB(item.process_id) }>
                                    {item.camera.name}
                                </div>
                            </Fragment>
                        )
                    }) 
                }
                {
                showModal && <CameraModal/>
                }
            </div>
            
           }
        </>
    )
}