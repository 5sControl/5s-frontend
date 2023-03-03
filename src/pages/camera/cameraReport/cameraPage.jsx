/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { ReportPage } from "../../Reports/ReportsPage"
import { useCookies } from "react-cookie"

import './cameraPage.scss'

export const CameraPage = () => {
    const [cookies] = useCookies(['token'])
    return (
        <>
            <ReportPage control={'machine_control'} />
        </>
    )
}