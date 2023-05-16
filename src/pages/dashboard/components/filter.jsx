import styles from './filter.module.scss';
import { ReactPortal } from '../../../components/reactPortal';
import { Cross } from '../../../assets/svg/SVGcomponent';
import { Checkbox } from '../../../components/checkbox';
import { parsingAlgorithmName } from '../../../functions/parsingAlgorithmName';
import { Button } from '../../../components/button';

export const FilterForm = ({ setIsShowFilter, cameras, algorithms, dataCount }) => {
  const onSubmit = () => {
    console.log('sdfsdf');
  };
  console.log(algorithms);
  return (
    <ReactPortal wrapperId="filter-container">
      <div id="filter" className={styles.wrapper}>
        <form className={`${styles.content} `} onSubmit={onSubmit}>
          <div className={styles.settings}>
            <div className={styles.header}>
              <h3 className={styles.header_title}>Filters</h3>
              <Cross className={styles.header_cross} onClick={setIsShowFilter} />
            </div>
            <div className={styles.scrollarea}>
              <div className={styles.block}>
                <legend className={styles.block_title}>Algorithm</legend>
                {algorithms.map((element, index) => (
                  <Checkbox
                    key={index}
                    id={element.name}
                    name={'algorithm'}
                    value={element.name}
                    label={parsingAlgorithmName(element.name)}
                    // isChecked={filterData['operation-status'].includes(value)}
                    // onChange={onChange}
                  />
                ))}
              </div>

              <div className={styles.block}>
                <legend className={styles.block_title}>Camera</legend>

                {cameras.length > 0 &&
                  cameras.map((element, index) => (
                    <Checkbox
                      key={index}
                      id={element.id}
                      name={'camera'}
                      value={element.id}
                      label={element.name}
                      // isChecked={filterData['operation-name'].includes(element)}
                      // onChange={onChange}
                      className={styles.checkbox}
                    />
                  ))}
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <p className={styles.footer_text}>{dataCount} reports were found</p>
            <div className={styles.footer_buttons}>
              <Button text="Reset" variant="text" />
              <Button text="Apply" type="submit" />
            </div>
          </div>
        </form>
      </div>
    </ReactPortal>
  );
};
