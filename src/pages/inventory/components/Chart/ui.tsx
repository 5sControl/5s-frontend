import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../../../store/hooks';
import { selectInventory } from '../../inventorySlice';
import { BarChart } from '../BarChart';
import * as d3 from 'd3';

import styles from './chart.module.scss';

export const Chart: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const { inventoryHistoryData } = useAppSelector(selectInventory);

  useEffect(() => {
    if (ref && ref.current) {
      const wrapper = (d3.select(ref.current).node() as Element).getBoundingClientRect();
      wrapper && setSize({ width: wrapper.width, height: wrapper.height });
    }
  }, []);

  return (
    <div id="chartBar" ref={ref}>
      {size.width && inventoryHistoryData && (
        <BarChart
          data={inventoryHistoryData}
          width={size.width}
          height={window.screen.height / 2.5}
        />
      )}

      <div className={styles.labels}>
        <div className={styles.label}>
          <div className={`${styles.labelInStock} ${styles.labelStock}`}></div>
          <p>In stock</p>
        </div>
        <div className={styles.label}>
          <div className={`${styles.labelLowStock} ${styles.labelStock}`}></div>
          <p>Low stock level</p>
        </div>
        <div className={styles.label}>
          <div className={`${styles.labelOutStock} ${styles.labelStock}`}></div>
          <p>Out of stock</p>
        </div>
      </div>
    </div>
  );
};
