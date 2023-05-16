import styles from './filter.module.scss';
import { ReactPortal } from '../../../components/reactPortal';
import { Cross } from '../../../assets/svg/SVGcomponent';
import { Checkbox } from '../../../components/checkbox';
import { parsingAlgorithmName } from '../../../functions/parsingAlgorithmName';
import { Button } from '../../../components/button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const FilterForm = ({ setIsShowFilter, cameras, algorithms, dataCount, update }) => {
  const [algorithmsURL, setAlgorithmsURL] = useState([]);
  const [camerasURL, setCamerasURL] = useState([]);
  const navigate = useNavigate();

  const onReset = () => {
    update();
    setIsShowFilter();
    navigate('/dashboard');
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setAlgorithmsURL(searchParams.getAll('algorithm'));
    setCamerasURL(searchParams.getAll('camera'));
  }, []);

  const onChangeAlgo = (e) => {
    if (algorithmsURL.includes(e.target.value)) {
      setAlgorithmsURL(algorithmsURL.filter((el) => el !== e.target.value));
    } else {
      setAlgorithmsURL([...algorithmsURL, e.target.value]);
    }
  };

  const onChangeCam = (e) => {
    if (camerasURL.includes(e.target.value)) {
      setCamerasURL(camerasURL.filter((el) => el !== e.target.value));
    } else {
      setCamerasURL([...camerasURL, e.target.value]);
    }
  };

  console.log(algorithmsURL);
  console.log(camerasURL);

  return (
    <ReactPortal wrapperId="filter-container">
      <div id="filter" className={styles.wrapper}>
        <form className={`${styles.content} `}>
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
                    isChecked={algorithmsURL.includes(element.name)}
                    onChange={onChangeAlgo}
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
                      isChecked={camerasURL.includes(element.id)}
                      onChange={onChangeCam}
                      className={styles.checkbox}
                    />
                  ))}
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <p className={styles.footer_text}>{dataCount} reports were found</p>
            <div className={styles.footer_buttons}>
              <Button text="Reset" variant="text" onClick={onReset} />
              <Button text="Apply" type="submit" />
            </div>
          </div>
        </form>
      </div>
    </ReactPortal>
  );
};
