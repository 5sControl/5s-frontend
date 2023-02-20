import moment from "moment";
import { Camera, Algorithm } from "../../assets/svg/SVGcomponent";

export const ReportListItem = ({item, setCurrentReport, currentReport}) =>{
    return (
        <>
           <div className='dashboard__reports_item' onClick={()=>setCurrentReport(item)}>
                {  (window.location.pathname.includes('safety') || window.location.pathname.includes('dashboard'))&& <div className={currentReport.id === item.id ? 'dashboard__reports_item_title active': 'dashboard__reports_item_title'}>{item.date_created}</div>}
                { (window.location.pathname.includes('idle') || window.location.pathname.includes('machine'))  && <div className={currentReport.id === item.id ? 'dashboard__reports_item_title active': 'dashboard__reports_item_title'}>{moment(new Date(item.start_tracking)).format('YYYY-MM-DD')} |  {moment(new Date(item.start_tracking)).format('HH:mm:ss') } - {moment(new Date(item.stop_tracking)).format('HH:mm:ss') }</div>}
                <div>{`# ${item.id}`}</div>
                <div><Camera/> {item.camera}</div>
                <div><Algorithm/> Safety control:{item.action}</div>
            </div>
        </>
    )
}