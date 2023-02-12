import './main.scss'
import logo from '../../assets/svg/icon.svg'
import { useState } from 'react'
export const Main = () =>{

    const [stage, setStage] = useState('begin')

    return (
        <>
        {
        stage ==='begin' &&
            <div className='main'>
                <img src={logo} alt='logo' className='main__logo'/>
                <span className='main__span'>
                    Congratulations! <br/>You have successfully installed the 5S Control’s Docker and now ready to use it. Complete the setup to start.
                </span>
                <button className='main__start' onClick={() => setStage('algorithm')}>
                    Start Setup
                </button>
            </div>
        } 
        {
        stage ==='algorithm' &&
            <div className='selection'>
                <h2 className='selection__title'>Algorithm selection</h2>
                <h3 className='selection__subtitle'>Select an algorithm you want to use for monitoring.</h3>
                <div className='selection__container'>
                    <div>
                        <h4>Safety Control: Ear protection</h4>
                        <h5>Detects if worker is not wearing protective headphones.</h5>
                    </div>
                    <input type='radio' className='readiobutton' checked={true}/>
                </div>
                <div className='selection__container'>
                    <div>
                        <h4>Safety Control: Head protection</h4>
                        <h5>Detects if worker is not wearing protective helmet.</h5>
                    </div>
                    <input type='radio' className='readiobutton'/>
                </div>
                <div className='selection__container'>
                    <div>
                        <h4>Safety Control: Hand protection</h4>
                        <h5>Detects if worker is not wearing protective gloves.</h5>
                    </div>
                    <input type='radio' className='readiobutton'/>
                </div>
                <div className='selection__container'>
                    <div>
                        <h4>Safety Control: Reflective jacket</h4>
                        <h5>Detects if worker is not wearing reflective jacket.</h5>
                    </div>
                    <input type='radio' className='readiobutton'/>
                </div>
                <div className='selection__container'>
                    <div>
                        <h4>Idle Control</h4>
                        <h5>Detects if worker is idle.</h5>
                    </div>
                    <input type='radio' className='readiobutton'/>
                </div>
                <div className='selection__container'>
                    <div>
                        <h4>Tool Control</h4>
                        <h5>Detects when worker takes tools from the bench.</h5>
                    </div>
                    <input type='radio' className='readiobutton'/>
                </div>
            </div>
        }   
        </>
    )
}