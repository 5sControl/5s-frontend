/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react"
import { ReportPage } from "../Reports/ReportsPage"
import { deleteProcess, getProcess } from "../../api/requests"
import { useCookies } from "react-cookie"

export const AlgorithmPage = ({control}) => {
    const [cookies] = useCookies(['token'])
    const [camera, setCamera] = useState(false)
    useEffect(() => {
        getProcess(window.location.hostname, cookies.token).then(e=> {
            setCamera(e.data.filter(cam => cam.algorithm.name === control))
        })
    },[])
    return (
        <>
            <ReportPage control={control} />
            {console.log(camera)}
            {
                camera && 
                camera.map((data, index) => {
                    return (
                        <Fragment key={index}>
                            <div onClick={() => deleteProcess(window.location.hostname, cookies.token, data.process_id)}>{data.camera.name}</div>
                        </Fragment>
                    )
                })
            }
        </>
    )
}