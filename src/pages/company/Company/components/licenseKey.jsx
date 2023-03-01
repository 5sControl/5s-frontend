import { useState } from "react";

export const LicenseKey = () => {
    const [licenceKey, setLicenceKey] = useState('');
    const send = () => {
        console.log(licenceKey);
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