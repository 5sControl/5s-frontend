import { Fragment } from "react"
import { getIsInternet } from "../api/getURL"
import { API_IMAGES_I } from "../api/api"
import close from '../assets/svg/close.svg'

const CameraChoise = ({selectType, onChangeHandler}) => {
    console.log(selectType)
    return (
        <div className='select__cameras'>
        {
            selectType.obj.map((el,ind) =>
                <Fragment key={el.id}>
                    {console.log(el)}
                    <div className={'select__cameras_item'}>
                        <img  src={getIsInternet(window.location.hostname) ? 
                                `${API_IMAGES_I}/images/${el.ip}/snapshot.jpg` : 
                                `http://${window.location.hostname}/images/${el.ip}/snapshot.jpg`}  alt='Camera'
                        />
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
    )
}

export const CameraSelect = ({selectType, onChangeHandler, setSelectType, doneHandler}) => {
    return (
        <div className='select'>
        <div className='select__container'>
            <div className='select__header'>
                <h1>Select up to 5 more cameras to use</h1>
                <img src={close} alt='Close' onClick={() => setSelectType('')}/>
            </div>
            <CameraChoise 
               selectType={selectType}
               onChangeHandler={(e) => onChangeHandler(e)}
           />
            <div className='select__buttons'>
                <button className='select__buttons_cancel' onClick={() => setSelectType('')}>Cancel</button>
                <button className='select__buttons_done' onClick={doneHandler}>Done</button>
            </div>
        </div>
    </div>
    )
}