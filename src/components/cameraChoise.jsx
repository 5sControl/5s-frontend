import { Fragment } from "react"

import close from '../assets/svg/close.svg'

const CameraChoise = ({selectType, onChangeHandler}) => {
    console.log(selectType)
    return (
        <div className='select__cameras'>
        {
            selectType.obj.map((el,ind) =>
                <Fragment key={el.id}>
                    <div className={'select__cameras_item'}>
                        <img src={`data:image/png;base64, ${localStorage.getItem(el.ip)}`} alt='Camera'/>
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