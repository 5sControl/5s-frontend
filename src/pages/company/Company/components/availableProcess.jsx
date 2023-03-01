/* eslint-disable react-hooks/exhaustive-deps */
import { useCookies } from "react-cookie"
import { getProcess } from "../../../../api/requests"
import { useEffect, useState } from "react"

export const AvailableProcess = () => {

    const [cookies] = useCookies(["token"])
    const [process, setProcess] = useState([])

    useEffect(() => {
        getProcess(window.location.hostname, cookies.token)
        .then(el =>{
            setProcess(el.data)
        })
    },[])
    
    return (
        <div className="company__available">
            <h1>Available process</h1>
            {
                process.map((el, index) => {
                    return (
                        <div key={index} className="company__available_item">   
                            <span>{el.camera.name}</span>
                            <span>{el.algorithm.name}</span>
                        </div>
                    )
                })
            }
        </div>
    )
}