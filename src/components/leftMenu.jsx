import { Link } from 'react-router-dom'
import { Algorithm, Camera, Dashboard } from '../assets/svg/SVGcomponent'
import logo from '../assets/svg/icon.svg'
import { useState } from 'react'

export const LeftMenu = () =>{
    const [useless, setUseless] = useState(false)

    const send = () =>{
        setUseless(!useless)
    }
    return(
    <aside className="leftMenu">
        <Link to='/' onClick={send}>
            <img src={logo} alt='logo' />
        </Link>
        <ul>
            <li className={window.location.pathname.includes('dashboard') ? 'active' : 'noActive'}>
                <Link to='dashboard' onClick={send}>
                    <Dashboard />
                    <span>Dashboard</span>
                </Link>
            </li>
            <li className={window.location.pathname.includes('camera') ? 'active' : 'noActive'}>
                <Link to='camera' onClick={send}>
                    <Camera/>
                    <span>Camera</span>
                </Link>
            </li>
            <li className={window.location.pathname.includes('algorithm') ? 'active' : 'noActive'}>
                <Algorithm/>
                <span>Algorithm</span>
            </li>
        </ul>
    </aside>
    )
}