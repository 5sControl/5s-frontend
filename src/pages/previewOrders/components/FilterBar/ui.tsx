import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { Button } from '../../../../components/button';
import { Radio } from '../../../../components/radio';
import { ReactPortal } from '../../../../components/reactPortal';
import styles from './filter.module.scss';
import {
  FilterDataType,
  selectOrdersList,
  setOperationsFilterData,
  setOrderStatusFilterData,
} from '../OrdersList/ordersListSlice';
import { useNavigateSearch } from '../../../../functions/useNavigateSearch';
import { useSearchParams } from 'react-router-dom';
import { Cross } from '../../../../assets/svg/SVGcomponent';
import { Checkbox } from '../../../../components/checkbox';
import { operationStatusData, orderStatusData } from './config';

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
  const { filterData, isLoadingFilterOperations, filterOperationsData, isErrorFilterOperations } =
    useAppSelector(selectOrdersList);
  const [searchParams] = useSearchParams();
  const navigateSearch = useNavigateSearch();

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

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === 'order-status') {
      dispatch(setOrderStatusFilterData(value ?? 'all'));
    }
    if (name === 'operation-status' || name === 'operation-name') {
      dispatch(setOperationsFilterData({ [name]: value }));
    }
  };

  const onSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const queryParams = Object.fromEntries([...searchParams]);
    const newQueryParams = {
      ...queryParams,
      ...filterData,
    };

    navigateSearch('/orders-view', newQueryParams as any);
    handleSubmit(filterData);
  };

  return (
    <ReactPortal wrapperId="filter-container">
      <div id="filter" className={styles.wrapper} onClick={handleClickToBg}>
        <form className={`${styles.content} ${className}`} onSubmit={onSubmit}>
          <div className={styles.settings}>
            <div className={styles.header}>
              <h3 className={styles.header_title}>Filters</h3>
              <Cross className={styles.header_cross} onClick={handleClose} />
            </div>
            <div className={styles.scrollarea}>
              <div className={styles.block}>
                <legend className={styles.block_title}>Order status</legend>
                {orderStatusData.map(({ id, value, label, name }) => (
                  <Radio
                    key={id}
                    id={id}
                    name={name}
                    value={value}
                    label={label}
                    checked={value === filterData['order-status']}
                    onChange={onChange}
                  />
                ))}
              </div>

              <div className={styles.block}>
                <legend className={styles.block_title}>Operation</legend>
                <div className={styles.block_content}>
                  {isLoadingFilterOperations && !isErrorFilterOperations
                    ? 'Loading...'
                    : isErrorFilterOperations
                    ? 'Error'
                    : filterOperationsData.map((element, index) => (
                        <Checkbox
                          key={index}
                          id={index.toString()}
                          name="operation-name"
                          value={element}
                          label={element}
                          isChecked={filterData['operation-name'].includes(element)}
                          onChange={onChange}
                          className={styles.checkbox}
                        />
                      ))}
                </div>
              </div>

              <div className={styles.block}>
                <legend className={styles.block_title}>Operation status</legend>
                {operationStatusData.map(({ id, label, name, value }) => (
                  <Checkbox
                    key={id}
                    id={id}
                    name={name}
                    value={value}
                    label={label}
                    isChecked={filterData['operation-status'].includes(value)}
                    onChange={onChange}
                  />
                ))}
              </div>
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
