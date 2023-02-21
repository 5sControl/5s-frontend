import { Fragment } from "react";
import { Timeline } from "./timeline"

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