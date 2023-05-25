import { useState, useEffect } from 'react';
import 'react-date-range/dist/styles.css'; // Импортируйте стили
import 'react-date-range/dist/theme/default.css';
import moment from 'moment';

import { Button } from '../../../components/button';

import { ArrowBottom, Filter, Delete } from '../../../assets/svg/SVGcomponent';
import { FilterForm } from './filter';
import { useNavigate } from 'react-router-dom';
import { DayPicker } from '../../../components/dayPicker/dayPicker';

import styles from './header.module.scss';

export const Header = ({ selectDate, setSelectDate, cameras, algorithms, data, update }) => {
  const [visibleModalDate, setVisibleModalDate] = useState(false);
  const [isShowFilter, setIsShowFilter] = useState(false);

  const [algorithmsURL, setAlgorithmsURL] = useState([]);
  const [camerasURL, setCamerasURL] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const onDelete = (text) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete(text);
    navigate('/dashboard?' + searchParams.toString());
    setIsShowFilter();
    update();
    setRefresh(!refresh);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setAlgorithmsURL(searchParams.getAll('algorithm'));
    setCamerasURL(searchParams.getAll('camera'));
  }, [refresh, data]);

  const handleSelect = (ranges) => {
    setSelectDate(moment(ranges.selection.startDate).format('YYYY-MM-DD'));
    setVisibleModalDate(false);
  };

  return (
    <div className={styles.title}>
      <h1 className={styles.title_h1}>Dashboard</h1>
      <div className={styles.title__filter}>
        <Button
          text="Filter"
          IconLeft={Filter}
          type="button"
          variant="oval"
          iconColor={
            algorithmsURL.length + camerasURL.length > 0 ? 'var(--Orange)' : 'var(--HightEmphasis)'
          }
          onClick={() => setIsShowFilter(true)}
        />
        {algorithmsURL.length > 0 && (
          <Button
            text={`${'Algorithms'} ${algorithmsURL.length}`}
            IconRight={Delete}
            type="button"
            variant="oval"
            iconColor={'var(--MediumEmphasis)'}
            onClick={() => onDelete('algorithm')}
          />
        )}
        {camerasURL.length > 0 && (
          <Button
            text={`${'Cameras'} ${camerasURL.length}`}
            IconRight={Delete}
            type="button"
            variant="oval"
            iconColor={'var(--MediumEmphasis)'}
            onClick={() => onDelete('camera')}
          />
        )}
        <button
          onClick={() => setVisibleModalDate(!visibleModalDate)}
          className={styles.title_button}
        >
          {new Date(selectDate ? selectDate : new Date().toDateString()).toDateString() ===
          new Date().toDateString()
            ? 'Today, ' + (selectDate ? moment(selectDate).format('ll') : moment().format('ll'))
            : moment(selectDate).format('ll')
            ? moment(selectDate).format('ll')
            : moment().format('ll')}
          <ArrowBottom style={{ color: 'red', marginLeft: '10px', width: '9px' }} />
        </button>
      </div>

      {visibleModalDate && (
        <DayPicker
          selectDate={selectDate}
          handleSelect={handleSelect}
          onClose={() => setVisibleModalDate(false)}
        />
      )}
      {isShowFilter && (
        <FilterForm
          setIsShowFilter={() => setIsShowFilter(false)}
          cameras={cameras}
          algorithms={algorithms}
          dataCount={data.length}
          update={update}
        />
      )}
    </div>
  );
};
