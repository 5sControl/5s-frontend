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

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection',
  };

  const handleSelect = (date: RangeKeyDict) => {
    date.selection.startDate?.setHours(date.selection.startDate.getHours() + 3);
    date.selection.endDate?.setHours(date.selection.endDate.getHours() + 3);

    console.log(date.selection.startDate?.toISOString());

    setStartDate(date.selection.startDate as Date);
    setEndDate(date.selection.endDate as Date);
  };

  const handleClick = () => {
    setIsOpenDatePicker(!isOpenDatePicker);
  };

  const handleClickApply = () => {
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

    const queryParams = Object.fromEntries([...searchParams]);
    navigateSearch('/orders-view', { ...queryParams, from: dateData.from, to: dateData.to });

    setIsOpenDatePicker(!isOpenDatePicker);
  };

  useEffect(() => {
    const queryFromParam = searchParams.get('from') as string;
    const queryToParam = searchParams.get('to') as string;

    const queryDateParam: FilterDateDataType = {
      from: queryFromParam,
      to: queryToParam,
    };

    setStartDate(new Date(queryDateParam.from));
    setEndDate(new Date(queryDateParam.to));
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
        />
      </div>

      {isOpenDatePicker && (
        <div ref={refPicker} className={styles.picker}>
          <DateRangePicker
            ranges={[selectionRange]}
            onChange={handleSelect}
            maxDate={addDays(new Date(), 0)}
            rangeColors={['var(--Orange)', 'var(--Orange)']}
            inputRanges={[]}
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
