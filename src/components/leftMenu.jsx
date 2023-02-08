import { Link } from 'react-router-dom'
import { Algorithm, Camera, Dashboard } from '../assets/svg/SVGcomponent'
import logo from '../assets/svg/icon.svg'

export const LeftMenu = () =>{
    return(
    <aside className="leftMenu">
        <img src={logo} alt='logo'/>
        <ul>
            <li className='active'>
                <Link to='dashboard'>
                    <Dashboard />
                    <span>Dashboard</span>
                </Link>
            </li>
            <li className='noActive'> 
                <Link to='camera'>
                    <Camera/>
                    <span>Camera</span>
                </Link>
            </li>
            <li className='noActive'>
                <Algorithm/>
                <span>Algorithm</span>
            </li>
        </ul>
    </aside>
    )
}