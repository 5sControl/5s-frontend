import { useEffect } from "react"
import { ReportPage } from "../Reports/ReportsPage"
import { getSelectedCameras } from "../../api/requestHomeAndOffice"

export const AlgorithmPage = ({control}) => {
    useEffect(() => {
        getSelectedCameras(window.location.hostname).then(e=> {
            console.log(e)
        })
    },[])
    return (
        <>
            <ReportPage control={control} />
        </>
    )
}