import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { Button } from '../../../../components/button';
import { Radio } from '../../../../components/radio';
import { ReactPortal } from '../../../../components/reactPortal';
import styles from './filter.module.scss';
import { FilterDataType, selectOrdersList, setFilterData } from '../OrdersList/ordersListSlice';

type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: (data: FilterDataType) => void;
  handleResetFilters: () => void;
  className?: string;
};

export const FilterBar: React.FC<PropsType> = ({
  isOpen,
  handleClose,
  handleSubmit,
  handleResetFilters,
  className,
}) => {
  const dispatch = useAppDispatch();
  const { filterData } = useAppSelector(selectOrdersList);

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) => (e.key === 'Escape' ? handleClose() : null);
    document.body.addEventListener('keydown', closeOnEscapeKey);
    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [handleClose]);

  if (!isOpen) return null;

  const handleClickToBg = (event: React.MouseEvent) => {
    const { id } = event.target as HTMLDivElement;

    if (id === 'filter') {
      handleClose();
    }
  };

  const orderStatusData = [
    { id: 'range1', value: 'all', label: 'All' },
    { id: 'range2', value: 'started', label: 'Started' },
    { id: 'range3', value: 'completed', label: 'Completed' },
  ];

  const onChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    dispatch(setFilterData({ 'order-status': target.value }));
  };

  const onSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target;
    const orderStatus = target['order-status'].value;
    console.log('value: ' + orderStatus);
    const data = { 'order-status': orderStatus };

    handleSubmit(data);
  };

  return (
    <ReactPortal wrapperId="filter-container">
      <div id="filter" className={styles.wrapper} onClick={handleClickToBg}>
        <form className={`${styles.content} ${className}`} onSubmit={onSubmit}>
          <div className={styles.settings}>
            <h3 className={styles.title}>Filters</h3>
            <div className={styles.block}>
              <legend className={styles.block_title}>Order status</legend>
              {orderStatusData.map(({ id, value, label }) => (
                <Radio
                  key={id}
                  id={id}
                  name="order-status"
                  value={value}
                  label={label}
                  checked={value === filterData['order-status']}
                  onChange={onChangeRadio}
                />
              ))}
            </div>
          </div>

          <div className={styles.footer}>
            <p className={styles.footer_text}></p>
            <div className={styles.footer_buttons}>
              <Button text="Reset" variant="text" onClick={handleResetFilters} />
              <Button text="Apply" type="submit" />
            </div>
          </div>
        </form>
      </div>
    </ReactPortal>
  );
};
