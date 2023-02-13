import './main.scss'
import logo from '../../assets/svg/icon.svg'
import { Fragment, useState } from 'react'
import { getIsInternet } from '../../functions/getURL'

import {AiOutlineRight } from "react-icons/ai";

import close from '../../assets/svg/close.svg'
import camera from '../../assets/png/camera.png'
export const Main = () =>{
    // console.log(window.location.host)
    const [stage, setStage] = useState('begin')
    const [selectType, setSelectType] = useState('')

    const [cameras, setCameras] = useState([
        {
            id:1,
            ip:'192.168.0.1',
            position:'hall',
            isSelected: false
        },
        {
            id:2,
            ip:'192.168.0.2',
            position:'main',
            isSelected: false
        },
        {
            id:3,
            ip:'192.168.0.3',
            position:'main',
            isSelected: false
        },
        {
            id:4,
            ip:'192.168.0.3',
            position:'main',
            isSelected: false
        },
    ])

    const onChangeHandler = (id) => {
        setCameras( cameras.map(el => el.id === id ? {...el, isSelected:!el.isSelected} :el ))
    }
    
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
                <h2 className='selection__title'>Initial Setup</h2>
                <h3 className='selection__subtitle'>Select algorithms and cameras that will use them to start monitoring. You can always change your setup by going to the specific algorithms from Algorithms tab.</h3>
                <div className='selection__container' onClick={() => setSelectType('ear')}>
                    <div>
                        <h4>Safety Control: Ear protection</h4>
                        <h5>Detects if worker is not wearing protective headphones.</h5>
                    </div>
                    <AiOutlineRight/>
                </div>
                <div className='selection__container noAccess'>
                    <div>
                        <h4>Safety Control: Head protection</h4>
                        <h5>Detects if worker is not wearing protective helmet.</h5>
                    </div>
                    <AiOutlineRight/>
                </div>
                <div className='selection__container noAccess'>
                    <div>
                        <h4>Safety Control: Hand protection</h4>
                        <h5>Detects if worker is not wearing protective gloves.</h5>
                    </div>
                    <AiOutlineRight/>
                </div>
                <div className='selection__container noAccess' >
                    <div>
                        <h4>Safety Control: Reflective jacket</h4>
                        <h5>Detects if worker is not wearing reflective jacket.</h5>
                    </div>
                    <AiOutlineRight/>
                </div>
                <div className='selection__container noAccess'>
                    <div>
                        <h4>Idle Control</h4>
                        <h5>Detects if worker is idle.</h5>
                    </div>
                    <AiOutlineRight/>
                </div>
                <div className='selection__container noAccess'>
                    <div>
                        <h4>Tool Control</h4>
                        <h5>Detects when worker takes tools from the bench.</h5>
                    </div>
                </div>
            </div>
        }  
        <div className={stage!=='begin' ? 'visible' : 'novisible'}>
            <button onClick={() => console.log(cameras.filter(el=>el.isSelected))}>Continue</button>
        </div> 
        {
        selectType !== '' &&
            <>
                <div className='select'>
                    <div className='select__container'>
                        <div className='select__header'>
                            <h1>Select up to 5 more cameras to use</h1>
                            <img src={close} alt='Close' onClick={() => setSelectType('')}/>
                        </div>
                        <div className='select__cameras'>
                            {
                                cameras.map(el =>
                                    <Fragment key={el.id}>
                                        <div className='select__cameras_item'>
                                            <img src={camera} alt='Camera'/>
                                            <div className='select__cameras_item_footer'>
                                                <span>{el.ip}</span>
                                                <input type='checkbox'
                                                    checked={el.isSelected}
                                                     onChange={()=>onChangeHandler(el.id)}
                                                    />
                                            </div>
                                           
                                        </div>
                                    </Fragment>)
                            }
                        </div>
                        <div className='select__buttons'>
                            <button className='select__buttons_cancel' onClick={() => setSelectType('')}>Cancel</button>
                            <button className='select__buttons_done' onClick={() => setSelectType('')}>Done</button>
                        </div>
                    </div>
                </div>
            </>
        }
        </>
    )
}