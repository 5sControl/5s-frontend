import { Fragment } from 'react';
import { url, getIsInternet } from '../../../api/api';
import close from '../../../assets/svg/close.svg';

export const CameraSelect = ({ selectType, setSelectType, doneHandler }) => {
  const onChangeHandler = (id) => {
    setSelectType({
      obj: selectType.obj.map((el) => (el.id === id ? { ...el, isSelected: !el.isSelected } : el)),
      type: selectType.type,
    });
  };

  return (
    <div className="select">
      <div className="select__container">
        <div className="select__header">
          <h1>Select up to 5 more cameras to use</h1>
          <img src={close} alt="Close" onClick={() => setSelectType('')} />
        </div>
        <CameraChoise selectType={selectType} onChangeHandler={(e) => onChangeHandler(e)} />
        <div className="select__buttons">
          <button className="select__buttons_cancel" onClick={() => setSelectType('')}>
            Cancel
          </button>
          <button className="select__buttons_done" onClick={doneHandler}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

const CameraChoise = ({ selectType, onChangeHandler }) => {
  return (
    <div className="select__cameras">
      {selectType.obj.map((el) => (
        <Fragment key={el.id}>
          <div className={'select__cameras_item'}>
            <img
              src={
                getIsInternet(window.location.hostname)
                  ? `${url}/images/${el.ip}/snapshot.jpg`
                  : `http://${window.location.hostname}/images/${el.ip}/snapshot.jpg`
              }
              alt="Camera"
            />
            <div className="select__cameras_item_footer">
              <span>{el.ip}</span>
              <input
                type="checkbox"
                checked={el.isSelected}
                onChange={() => onChangeHandler(el.id)}
              />
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
};
