/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect } from "react"
import { getIsInternet } from "../../../api/getURL"
import { API_IMAGES_I,  } from "../../../api/api"
import { getSelectedCameras } from "../../../api/requestHomeAndOffice"
import { useState } from "react"

export const CameraModal = ({token, activeCameras}) => {

    const [allCameras, setAllCameras] = useState([])

    useEffect(() => {
        getSelectedCameras(window.location.hostname, token)
            .then((response) => {
            setAllCameras(response.data.map(item => {
                return{
                    ...item,
                    isSelected: activeCameras.includes(item.id)
                }
            }));
        })
    },[])

    console.log(allCameras)
    return (
        <section className="camera-modal">
            <div className="camera-modal__container">
            {allCameras.map((el, index) => (
                <Fragment key={index}>
                <div className={"select__cameras_item"}>
                    <img
                        src={
                            getIsInternet(window.location.hostname)
                            ? `${API_IMAGES_I}/images/${el.id}/snapshot.jpg`
                            : `http://${window.location.hostname}/images/${el.id}/snapshot.jpg`
                        }
                        alt="Camera"
                    />
                    <div className="select__cameras_item_footer">
                    <span>{el.id}</span>
                    <input
                        type="checkbox"
                        checked={el.isSelected}
                        onChange={() => setAllCameras([...allCameras, allCameras[index].isSelected = !allCameras[index].isSelected].slice(0, -1))}
                    />
                    </div>
                </div>
                </Fragment>
            ))}
            </div>
        </section>  
    )
}