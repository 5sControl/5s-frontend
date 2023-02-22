/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import moment from "moment"
import './timeline.scss'

const calculateTime = (startTime, endTime, ) => {
    let bufStart = new Date()
    let bufEnd = new Date()
    bufStart.setHours(Number(startTime.split(':')[0]), Number(startTime.split(':')[1]), Number(startTime.split(':')[2]))
    bufEnd.setHours(Number(endTime.split(':')[0]), Number(endTime.split(':')[1]), Number(endTime.split(':')[2]))
    return (bufEnd - bufStart) / 1000
}

export const Timeline = ({data, startDate, endDate, algorithm, startTime, endTime, setCurrentReportMain}) => {
    const seconds = calculateTime(startTime, endTime)
    const [timeLine, setTimeLine] = useState([])

    useEffect(()=>{
        if (data){
             let buf = [{id:0,time:moment().format(`YYYY-MM-DD ${endTime}`)}]
             data.forEach(el => {
                 buf.push({id:el.id, time:moment(new Date(el.stop_tracking)).add(3,'hours').format('YYYY-MM-DD HH:mm:ss')})
                 buf.push({id:el.id, time:moment(new Date(el.start_tracking)).add(3,'hours').format('YYYY-MM-DD HH:mm:ss')})
             })
             buf.push({id:0, time:moment().format(`YYYY-MM-DD ${startTime}`)})
             buf.reverse()
            //  buf = buf.filter(el => el.includes(moment().format("YYYY-MM-DD")))
             buf = buf.map((el, index,array) => index < array.length - 1 ? 
             {  
                id:el.id,
                time:moment(array[index + 1].time).diff(moment(el.time), 'seconds') }
             : 0)
             buf.pop()
             setTimeLine(buf)
        }
   },[data])

    return (
        <>
        {
        <section className="report-page_timeline">
            <div className="timeline">
                <span className="timeline__text"> {algorithm}</span>
                <div className="timeline__container">
                    {timeLine.map((el, ind) =>
                        <span 
                            key={ind}
                            style={{width:`${el.time/seconds*100}%`}}
                            className={ind % 2 ? 'timeline_green' : 'timeline_red'}
                            title ={`Duration: ${el.time} seconds`}
                            onClick = {() => el.id !== 0 ?setCurrentReportMain(el.id):undefined}
                        >     
                        </span>)}
                </div> 
            </div>
            <div className="timeline__line">
                <span>{startTime}</span>
                <span>{endTime}</span>
            </div>
        </section>
        } 
       
        </>
    )
}