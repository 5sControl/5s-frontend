/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import moment from "moment"
const seconds = 86400

export const Timeline = ({data}) => {

    const [timeLine, setTimeLine] = useState([])
    useEffect(()=>{
             let buf = [moment().format('YYYY-MM-DD HH:mm:ss')]
             data.results.forEach(el => {
                 buf.push(moment(new Date(el.stop_tracking)).format('YYYY-MM-DD HH:mm:ss'))
                 buf.push(moment(new Date(el.start_tracking)).format('YYYY-MM-DD HH:mm:ss'))
             })
             buf.push(moment("20230216").format('YYYY-MM-DD HH:mm:ss'))
             buf.reverse()
             buf = buf.filter(el => el.includes(moment().format("YYYY-MM-DD")))
             console.log(buf)
             buf = buf.map((el, index,array) => index < array.length - 1 ? moment(array[index + 1]).diff(moment(el), 'seconds') : 0)
             buf.pop()
             setTimeLine(buf)
   },[])

useEffect(() => {
 console.log(timeLine)
},[timeLine])

    
    return (
        <>{timeLine.length > 0 &&  
        <div className="timeline">
            {timeLine.map((el, ind) =>
                <span 
                    key={ind}
                    style={{width:`${el/seconds*100}%`}}
                    className={ind % 2 ? 'timeline_green' : 'timeline_red'}
                    title ={`Duration: ${el} seconds`}
                >
                    
                </span>)}
        </div> 
    }
           
        </>
    )
}