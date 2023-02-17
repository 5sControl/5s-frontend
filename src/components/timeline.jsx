/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import moment from "moment"
import './timeline.scss'
const seconds = 86400

export const Timeline = ({data}) => {

    const [timeLine, setTimeLine] = useState([])

    useEffect(()=>{
        if (data.results){
             let buf = [moment().format('YYYY-MM-DD HH:mm:ss')]
             data.results.forEach(el => {
                 buf.push(moment(new Date(el.stop_tracking)).format('YYYY-MM-DD HH:mm:ss'))
                 buf.push(moment(new Date(el.start_tracking)).format('YYYY-MM-DD HH:mm:ss'))
             })
             buf.push(moment('20230217').format('YYYY-MM-DD HH:mm:ss'))
             buf.reverse()
             buf = buf.filter(el => el.includes(moment().format("YYYY-MM-DD")))
             console.log(buf)
             buf = buf.map((el, index,array) => index < array.length - 1 ? moment(array[index + 1]).diff(moment(el), 'seconds') : 0)
             buf.pop()
             setTimeLine(buf)
        }
   },[])

    return (
        <>
        {
        timeLine.length > 0 &&  
        <section className="report-page_timeline">
            <div className="report-page_timeline_header">
                <ul>
                    <li className="green-li"><span>Supervised</span></li>
                    <li className="red-li"><span>Unsupervised</span></li>
                </ul>
            </div>
            <div className="timeline">
                <span className="timeline__text"> Camera 1</span>
                <div className="timeline__container">
                    {timeLine.map((el, ind) =>
                        <span 
                            key={ind}
                            style={{width:`${el/seconds*100}%`}}
                            className={ind % 2 ? 'timeline_red' : 'timeline_green'}
                            title ={`Duration: ${el} seconds`}
                        >     
                        </span>)}
                </div> 
            </div>
            <div className="timeline__line">
                <span>{moment().add(-1, 'days').format('YYYY-MM-DD HH:mm:ss')}</span>
                <span>{moment().format('YYYY-MM-DD HH:mm:ss')}</span>
            </div>
        </section>
        } 
       
        </>
    )
}