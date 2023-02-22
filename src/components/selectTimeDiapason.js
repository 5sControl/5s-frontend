export const SelectTimeDiapason = ({startTime, setStartTime, setEndTime, endTime, setVisibleModal, update}) => {
    return (
        <div className="dashboard__time">
            <div>
                <p>Starting time</p>
              <select value={startTime} onChange={(e) => setStartTime(e.target.value)} className="dashboard__time_select">
                <option value="7:00:00">7:00</option>
                <option value="8:00:00">8:00</option>
                <option value="9:00:00">9:00</option>
                <option value="10:00:00">10:00</option>
                <option value="11:00:00">11:00</option>
                <option value="12:00:00">12:00</option>
                <option value="13:00:00">13:00</option>
                <option value="14:00:00">14:00</option>
                <option value="15:00:00">15:00</option>
                <option value="16:00:00">16:00</option>
                <option value="17:00:00">17:00</option>
                <option value="18:00:00">18:00</option>
                <option value="19:00:00">19:00</option>
              </select>
              <p>End time</p>
              <select value={endTime} onChange={(e) => setEndTime(e.target.value)} className="dashboard__time_select">
                <option value="7:00:00">7:00</option>
                <option value="8:00:00">8:00</option>
                <option value="9:00:00">9:00</option>
                <option value="10:00:00">10:00</option>
                <option value="11:00:00">11:00</option>
                <option value="12:00:00">12:00</option>
                <option value="13:00:00">13:00</option>
                <option value="14:00:00">14:00</option>
                <option value="15:00:00">15:00</option>
                <option value="16:00:00">16:00</option>
                <option value="17:00:00">17:00</option>
                <option value="18:00:00">18:00</option>
                <option value="19:00:00">19:00</option>
              </select>
            </div>
              <div className="dashboard__time_footer">
                <button className="dashboard__time_footer_cancel" onClick={() => setVisibleModal(false)}>Cancel</button>
                <button className="dashboard__time_footer_create" onClick={update}>Apply</button>
              </div>
                
          </div>
    )
}