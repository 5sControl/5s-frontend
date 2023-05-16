import styles from './filter.module.scss';
import { ReactPortal } from '../../../components/reactPortal';
import { Cross } from '../../../assets/svg/SVGcomponent';

export const FilterForm = ({ setIsShowFilter }) => {
  const onSubmit = () => {
    console.log('sdfsdf');
  };
  return (
    <ReactPortal wrapperId="filter-container">
      <div id="filter" className={styles.wrapper} onClick={setIsShowFilter}>
        <form className={`${styles.content} `} onSubmit={onSubmit}>
          <div className={styles.settings}>
            <div className={styles.header}>
              <h3 className={styles.header_title}>Filters</h3>
              <Cross className={styles.header_cross} onClick={setIsShowFilter} />
            </div>
            <div className={styles.scrollarea}>
              <div className={styles.block}>
                <legend className={styles.block_title}>Algorithm</legend>
                {/* {operationStatusData.map(({ id, label, name, value }) => (
                  <Checkbox
                    key={id}
                    id={id}
                    name={name}
                    value={value}
                    label={label}
                    isChecked={filterData['operation-status'].includes(value)}
                    onChange={onChange}
                  />
                ))} */}
              </div>

              <div className={styles.block}>
                <legend className={styles.block_title}>Camera</legend>
                {/* <div className={styles.block_content}>
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
                </div> */}
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            {/* <p className={styles.footer_text}>{ordersList?.count} reports were found</p>
            <div className={styles.footer_buttons}>
              <Button text="Reset" variant="text" onClick={handleResetFilters} />
              <Button text="Apply" type="submit" />
            </div> */}
          </div>
        </form>
      </div>
    </ReactPortal>
  );
};
