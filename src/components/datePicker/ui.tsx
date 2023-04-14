import React, { useEffect, useRef, useState } from 'react';
import { DateRangePicker, RangeKeyDict } from 'react-date-range';
import { addDays } from 'date-fns';
import { Button } from '../button';
import moment from 'moment';
import styles from './datePicker.module.scss';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import './calendar.scss';
import { useOutsideClick } from '../../functions/useOutsideClick';
import { useSearchParams } from 'react-router-dom';
import { useNavigateSearch } from '../../functions/useNavigateSearch';
import {
  FilterDateDataType,
  getOrdersAsync,
  selectOrdersList,
  setFilterDateData,
} from '../../pages/previewOrders/components/OrdersList/ordersListSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useCookies } from 'react-cookie';
import { ArrowDown, ArrowTop } from '../../assets/svg/SVGcomponent';
import { enGB } from 'date-fns/locale';
import staticRangesGenerator from './staticRangesGenerator';

export const DatePicker: React.FC = () => {
  const startDateDefault = new Date();
  startDateDefault.setMonth(startDateDefault.getMonth() - 1);
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const navigateSearch = useNavigateSearch();
  const [cookies] = useCookies(['token']);
  const { filterData, filterDateData, ordersList, search } = useAppSelector(selectOrdersList);
  const [startDate, setStartDate] = useState<Date>(startDateDefault);
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  const refPicker = useRef<HTMLDivElement>(null);
  const refButton = useRef<HTMLDivElement>(null);
  useOutsideClick(refPicker, () => setIsOpenDatePicker(false), refButton);
  const staticRanges = staticRangesGenerator(enGB as any);

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection',
  };

  const handleSelect = (date: RangeKeyDict) => {
    console.log('date:', date);
    setStartDate(date.selection.startDate as Date);
    setEndDate(date.selection.endDate as Date);
  };

  const handleClick = () => {
    setIsOpenDatePicker(!isOpenDatePicker);
  };

  const handleClickApply = () => {
    // this is kostil - add 3 hours for local zone
    if (startDate.getDate() === endDate.getDate()) {
      startDate.setHours(startDate.getHours() + 3);
      endDate.setHours(startDate.getHours() + 3);
    }
    if (startDate.getDate() !== endDate.getDate()) {
      startDate.setHours(startDate.getHours() + 3);
    }
    const dateData = { from: startDate.toISOString(), to: endDate.toISOString() };

    dispatch(setFilterDateData(dateData));

    dispatch(
      getOrdersAsync({
        token: cookies.token,
        hostname: window.location.hostname,
        page: ordersList?.current_page as number,
        page_size: ordersList?.records_on_page as number,
        search,
        params: { ...filterData, ...dateData },
      })
    );

    navigateSearch('/orders-view', { from: dateData.from, to: dateData.to });
    setIsOpenDatePicker(!isOpenDatePicker);
  };

  useEffect(() => {
    const queryFromParam = searchParams.get('from') as string;
    const queryToParam = searchParams.get('to') as string;

    const queryDateParam: FilterDateDataType = {
      from: queryFromParam,
      to: queryToParam,
    };

    if (queryFromParam && queryToParam) {
      setStartDate(new Date(queryDateParam.from));
      setEndDate(new Date(queryDateParam.to));
    } else {
      setStartDate(new Date(filterDateData.from));
      setEndDate(new Date(filterDateData.to));
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <div ref={refButton}>
        <Button
          text={`${moment(filterDateData.from).format('ll')} - ${moment(filterDateData.to).format(
            'll'
          )}`}
          variant="oval"
          onClick={handleClick}
          iconColor="var(--LowEmphasis)"
          IconRight={isOpenDatePicker ? ArrowTop : ArrowDown}
        />
      </div>

      {isOpenDatePicker && (
        <div ref={refPicker} className={styles.picker}>
          <DateRangePicker
            locale={enGB}
            ranges={[selectionRange]}
            onChange={handleSelect}
            maxDate={addDays(new Date(), 0)}
            rangeColors={['var(--Orange)', 'var(--Orange)']}
            inputRanges={[]}
            staticRanges={staticRanges}
          />
          <div className={styles.picker_buttons}>
            <Button text="Cancel" variant="outlined" onClick={handleClick} />
            <Button text="Apply" variant="contained" onClick={handleClickApply} />
          </div>
        </div>
      )}
    </div>
  );
};
