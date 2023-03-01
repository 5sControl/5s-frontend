import { Fragment } from "react"
import { getIsInternet } from "../../../api/getURL"
import { API_IMAGES_I,  } from "../../../api/api"
export const CameraModal = () => {
    return (
        <section className="camera-modal">
            <div className="camera-modal__container">
            {/* {selectType.obj.map((el) => (
                <Fragment key={el.id}>
                
                <div className={"select__cameras_item"}>
                    <img
                    src={
                        getIsInternet(window.location.hostname)
                        ? `${API_IMAGES_I}/images/${el.ip}/snapshot.jpg`
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
            ))} */}
            </div>
        </section>  
    )
}