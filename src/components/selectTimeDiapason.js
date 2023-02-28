import { useState } from "react"

export const SelectTimeDiapason = ({startTime, setStartTime, setEndTime, endTime, setVisibleModal, update}) => {
  
  const setDataToResponse = () => {
    setStartTime(date.startTime)
    setEndTime(date.endTime)
    setVisibleModal(false)
    update()
  }

  const [date, setDate] = useState({
    startTime: startTime,
    endTime: endTime
  })
    return (
        <div className="dashboard__time">
            <div>
              <p>Starting time</p>
              <select value={date.startTime} onChange={(e) => setDate({...date, startTime: e.target.value})}className="dashboard__time_select">
                <option value="3:00:00">3:00</option>
                <option value="7:00:00">7:00</option>
                <option value="7:30:00">7:30</option>
                <option value="8:00:00">8:00</option>
                <option value="8:30:00">8:30</option>
                <option value="9:00:00">9:00</option>
                <option value="9:30:00">9:30</option>
                <option value="10:00:00">10:00</option>
                <option value="10:30:00">10:30</option>
                <option value="11:00:00">11:00</option>
                <option value="11:30:00">11:30</option>
                <option value="12:00:00">12:00</option>
                <option value="12:30:00">12:30</option>
                <option value="13:00:00">13:00</option>
                <option value="13:30:00">13:30</option>
                <option value="14:00:00">14:00</option>
                <option value="14:30:00">14:30</option>
                <option value="15:00:00">15:00</option>
                <option value="15:30:00">15:30</option>
                <option value="16:00:00">16:00</option>
                <option value="16:30:00">16:30</option>
                <option value="17:00:00">17:00</option>
                <option value="17:30:00">17:30</option>
                <option value="18:00:00">18:00</option>
                <option value="18:30:00">18:30</option>
                <option value="19:00:00">19:00</option>
                <option value="23:59:00">23:59</option>
              </select>
              <p>End time</p>
              <select value={date.endTime} onChange={(e) => setDate({...date, endTime: e.target.value})} className="dashboard__time_select">
              <option value="3:00:00">3:00</option>
                <option value="7:00:00">7:00</option>
                <option value="7:30:00">7:30</option>
                <option value="8:00:00">8:00</option>
                <option value="8:30:00">8:30</option>
                <option value="9:00:00">9:00</option>
                <option value="9:30:00">9:30</option>
                <option value="10:00:00">10:00</option>
                <option value="10:30:00">10:30</option>
                <option value="11:00:00">11:00</option>
                <option value="11:30:00">11:30</option>
                <option value="12:00:00">12:00</option>
                <option value="12:30:00">12:30</option>
                <option value="13:00:00">13:00</option>
                <option value="13:30:00">13:30</option>
                <option value="14:00:00">14:00</option>
                <option value="14:30:00">14:30</option>
                <option value="15:00:00">15:00</option>
                <option value="15:30:00">15:30</option>
                <option value="16:00:00">16:00</option>
                <option value="16:30:00">16:30</option>
                <option value="17:00:00">17:00</option>
                <option value="17:30:00">17:30</option>
                <option value="18:00:00">18:00</option>
                <option value="18:30:00">18:30</option>
                <option value="19:00:00">19:00</option>
                <option value="23:59:00">23:59</option>
              </select>
            </div>
              <div className="dashboard__time_footer">
                <button className="dashboard__time_footer_cancel" onClick={() => setVisibleModal(false)}>Cancel</button>
                <button className="dashboard__time_footer_create" onClick={setDataToResponse}>Apply</button>
              </div>
                
          </div>
    )
}