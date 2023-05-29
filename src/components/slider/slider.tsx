import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { SliderArrow } from '../../assets/svg/SVGcomponent';
import styles from './slider.module.scss';
interface ImageSliderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  images: any[];
  currentCount: number;
  setCurrentCount: (cur: number) => void;
  isKeyDisable?: boolean;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  currentCount = 0,
  setCurrentCount,
  isKeyDisable = false,
}) => {
  const goToNextSlide = () => {
    const nextSlide = (currentCount + 1) % images.length;
    setCurrentCount(nextSlide);
  };

  const goToPreviousSlide = () => {
    const prevSlide = (currentCount - 1 + images.length) % images.length;
    setCurrentCount(prevSlide);
  };

  useEffect(() => {
    const arrowKey = (e: KeyboardEvent) => {
      if (currentCount !== 0 && e.key === 'ArrowLeft' && !isKeyDisable) {
        goToPreviousSlide();
      }
      if (currentCount !== images.length - 1 && e.key === 'ArrowRight' && !isKeyDisable) {
        goToNextSlide();
      }
    };
    document.body.addEventListener('keydown', arrowKey);
    return () => {
      document.body.removeEventListener('keydown', arrowKey);
    };
  }, [currentCount]);

  return (
    <div className={styles.container}>
      {!!currentCount && <SliderArrow onClick={goToPreviousSlide} className={styles.buttonLeft} />}
      <span className={styles.counter}>{`${currentCount + 1}/${images.length}`}</span>
      {images[currentCount] && images[currentCount].date && (
        <span className={styles.datetime}>{`${moment
          .utc(images[currentCount].date)
          .utcOffset(moment().utcOffset())
          .format('HH:mm:ss')}`}</span>
      )}
      <div className={styles.slider}>
        {images.map((photo, index) => (
          <img
            key={index}
            style={{ transform: `translateX(-${currentCount * 100}%)` }}
            src={
              process.env.REACT_APP_ENV === 'proxy'
                ? `${process.env.REACT_APP_NGROK + photo.image}`
                : process.env.REACT_APP_ENV === 'wify'
                ? `${process.env.REACT_APP_IP_SERVER}${photo.image}`
                : `http://${window.location.hostname}/${photo.image}`
            }
            alt={`Slide ${index + 1}`}
            className={styles.slides}
          />
        ))}
      </div>
      {currentCount !== images.length - 1 && (
        <SliderArrow onClick={goToNextSlide} className={styles.buttonRight} />
      )}
    </div>
  );
};

export default ImageSlider;
