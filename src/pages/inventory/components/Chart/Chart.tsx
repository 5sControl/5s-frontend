/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../../../store/hooks';
import { selectInventory } from '../../inventorySlice';
import { BarChart } from '../BarChart';
import * as d3 from 'd3';

import styles from './chart.module.scss';

export const Chart: React.FC<{ algorithm?: { id: number; name: string } }> = ({ algorithm }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const { inventoryHistoryData } = useAppSelector(selectInventory);
  const [sortedData, setSortedData] = useState<any[]>([]);
  useEffect(() => {
    if (ref && ref.current) {
      const wrapper = (d3.select(ref.current).node() as Element).getBoundingClientRect();
      wrapper && setSize({ width: wrapper.width, height: wrapper.height });
    }
  }, []);

  useEffect(() => {
    if (inventoryHistoryData && inventoryHistoryData.length > 0) {
      const buf = algorithm
        ? inventoryHistoryData.filter((report) => report.algorithm?.id === algorithm.id)
        : [...inventoryHistoryData];
      setSortedData(buf.sort((a: any, b: any) => a.id - b.id));
    }
  }, [inventoryHistoryData, algorithm]);

  return (
    <div id="chartBar" ref={ref}>
      {size.width && inventoryHistoryData && sortedData.length > 0 && (
        <BarChart data={sortedData} width={size.width} height={300} />
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
