import { NewTimeline } from './newTimeline';
import MultiRangeSlider, { ChangeResult } from 'multi-range-slider-react';
import styles from './timeline.module.scss';
import { useState } from 'react';

export const TimelineHub = ({ data, startDate, startTime, endTime, cameras }: any) => {
  const timeMax = 24 * 60;
  const curMin = 0;
  const [minTimeCaption, set_minTimeCaption] = useState('');
  const [maxTimeCaption, set_maxTimeCaption] = useState('');
  const handleTimeChange = (e: ChangeResult) => {
    console.log(e);
    const h = Math.floor(e.minValue / 60);
    const m = e.minValue % 60;
    const minH = h.toString().padStart(2, '0');
    const minM = m.toString().padStart(2, '0');
    set_minTimeCaption(minH + ':' + minM + ':00');

    const hh = Math.floor(e.maxValue / 60);
    const mm = e.maxValue % 60;
    const maxH = hh.toString().padStart(2, '0');
    const maxM = mm.toString().padStart(2, '0');
    set_maxTimeCaption(maxH + ':' + maxM + ':00');
  };

  console.log(minTimeCaption, maxTimeCaption);
  const getTimeLabels = (): string[] => {
    const arr: string[] = [];
    for (let i = 0; i <= 24; i = i + 3) {
      arr.push(i.toString().padStart(2, '0') + ':00');
    }
    return arr;
  };
  return (
    <>
      <MultiRangeSlider
        labels={getTimeLabels()}
        min={0}
        max={timeMax}
        minValue={curMin}
        maxValue={timeMax}
        step={1}
        subSteps={true}
        minCaption={minTimeCaption}
        maxCaption={maxTimeCaption}
        onInput={handleTimeChange}
      />
      <div className={styles.wrapper}>
        {cameras &&
          cameras.length > 0 &&
          cameras.map((el: any, id: number) => {
            return (
              <NewTimeline
                data={data.filter((dat: any) => dat.camera && dat.camera.id === el.id)}
                startDate={startDate}
                startTime={minTimeCaption}
                endTime={maxTimeCaption}
                camera={el}
                key={id}
              />
            );
          })}
      </div>
    </>
  );
};
