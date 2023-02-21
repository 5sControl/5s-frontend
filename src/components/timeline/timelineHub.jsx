import { Fragment } from "react";
import { Timeline } from "./timeline"
import './timeline'
export const TimelineHub = ({data, startDate, endDate}) => {
    const algorithm = data.reduce((prev, curr) =>{
        return [...new Set([...prev, curr.algorithm.name])];
      }, [])
      const cameras = data.reduce((prev, curr) =>{
        return [...new Set([...prev, curr.camera.name])];
      }, [])  
    console.log(algorithm, cameras)

    return (
        <div className="timeline-hub">
            <div className="timeline__description">
                <ul>
                    <li className="green-li"><span>Supervised</span></li>
                    <li className="red-li"><span>Unsupervised</span></li>
                </ul>
            </div>
            {
                cameras.map((el, id)=>{
                    return(
                        <Fragment key={id}>
                            <Timeline 
                                data={data}
                                startDate={startDate}
                                endDate={endDate}
                            />
                           
                        </Fragment>
                    )
                })
            }
           
        </div>
    )
}