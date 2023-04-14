import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Scale } from '../../../../components/scale';
import moment from 'moment';
export const Slider = ({ currentReport, setFullImage }) => {
  return (
    <>
      <Swiper
        className={'dashboard__report_image'}
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
              className="dashboard__report_image_src"
            />
            <div className="dashboard__report_image_time" onClick={() => console.log(photo)}>
              <span>{moment(photo.date).format('HH:MM:SS')}</span>
            </div>
            <Scale
              className="scale"
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
