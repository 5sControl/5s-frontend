/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import moment from "moment"
import './timeline.scss'
const seconds = 86400

export const Timeline = ({data, startDate, endDate}) => {
    console.log(data)

    const [timeLine, setTimeLine] = useState([])

    useEffect(()=>{
        if (data){
             let buf = [moment().format('YYYY-MM-DD HH:mm:ss')]
             data.forEach(el => {
                 buf.push(moment(new Date(el.stop_tracking)).add(3,'hours').format('YYYY-MM-DD HH:mm:ss'))
                 buf.push(moment(new Date(el.start_tracking)).add(3,'hours').format('YYYY-MM-DD HH:mm:ss'))
             })
             buf.push(startDate)
             buf.reverse()
            //  buf = buf.filter(el => el.includes(moment().format("YYYY-MM-DD")))
             buf = buf.map((el, index,array) => index < array.length - 1 ? moment(array[index + 1]).diff(moment(el), 'seconds') : 0)
             buf.pop()
             setTimeLine(buf)
        }
   },[])
    return (
        <>
        {
        <section className="report-page_timeline">

            <div className="timeline">
                <span className="timeline__text"> Camera 1</span>
                <div className="timeline__container">
                    {timeLine.map((el, ind) =>
                        <span 
                            key={ind}
                            style={{width:`${el/seconds*100}%`}}
                            className={ind % 2 ? 'timeline_green' : 'timeline_red'}
                            title ={`Duration: ${el} seconds`}
                        >     
                        </span>)}
                </div> 
            </div>
            <div className="timeline__line">
                <span>{startDate}</span>
                <span>{endDate}</span>
            </div>
        </section>
        } 
       
        </>
    )
}