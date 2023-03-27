import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const Slider = ({ currentReport, setFullImage }) => {
  return (
    <>
      <Swiper
        className={'slider'}
        modules={[Navigation, Pagination]}
        navigation={true}
        pagination={{ type: 'fraction' }}
        spaceBetween={50}
        slidesPerView={1}
      >
        {currentReport.photos.map((photo, id) => (
          <SwiperSlide key={id}>
            <img
              key={id}
              src={
                process.env.REACT_APP_ENV === 'proxy'
                  ? `${process.env.REACT_APP_NGROK + photo.image}`
                  : process.env.REACT_APP_ENV === 'wify'
                  ? `${process.env.REACT_APP_IP_SERVER}${photo.image}`
                  : `http://${window.location.hostname}/${photo.image}`
              }
              alt="report img"
              className="slider__image"
              onClick={() =>
                setFullImage(
                  process.env.REACT_APP_ENV === 'proxy'
                    ? `${process.env.REACT_APP_NGROK + photo.image}`
                    : process.env.REACT_APP_ENV === 'wify'
                    ? `${process.env.REACT_APP_IP_SERVER}${photo.image}`
                    : `http://${window.location.hostname}/${photo.image}`
                )
              }
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};
