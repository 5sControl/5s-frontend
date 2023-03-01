import { useState } from "react";
import { authorizationRequest } from "../../../../api/requestCompany";

export const LicenseKey = ({cookies}) => {
    const [licenceKey, setLicenceKey] = useState('');
    const send = () => {
        authorizationRequest(window.location.hostname, cookies, licenceKey).then((res) => {
            console.log(res)
        })
    }
   
    return (
        <div className='company__key'>
            <h1>Write license key</h1>
            <input type='text' 
                placeholder='Enter license key' 
                value = {licenceKey}
                onChange={(e) => setLicenceKey(e.target.value)}
            />
            <button onClick={send}>Send</button>
        </div>
    )
}