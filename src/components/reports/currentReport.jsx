import { API_IMAGES_I } from "../../api/api.js";
import { getIsInternet } from "../../api/getURL";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import moment from "moment";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const CurrentReport = ({
  currentReport,
  setFullImage,
  actionReport,
}) => {
  return (
    <>
      <div className="dashboard__report">
        <div className="dashboard__report_image">
          <Swiper
            className={"dashboard__report_image"}
            modules={[Navigation, Pagination]}
            navigation={true}
            pagination={{ type: "fraction" }}
            spaceBetween={50}
            slidesPerView={1}
            onSlideChange={(swiperCore) => {
              const { activeIndex } = swiperCore;
              console.log(activeIndex);
            }}
          >
            {currentReport.photos.map((photo, id) => (
              <SwiperSlide key={id}>
                <img
                  key={id}
                  src={
                    getIsInternet(window.location.hostname)
                      ? `${API_IMAGES_I + photo.image}`
                      : `http://${window.location.hostname}/${photo.image}`
                  }
                  alt="report img"
                  className="dashboard__report_image_src"
                  onClick={() =>
                    setFullImage(
                      getIsInternet(window.location.hostname)
                        ? `${API_IMAGES_I + photo.image}`
                        : `http://${window.location.hostname}/${photo.image}`
                    )
                  }
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="dashboard__report_item">
          <span>Date & Time</span>
          <span>
            {moment(new Date(currentReport.start_tracking)).add(3,'hours').format(
              "YYYY-MM-DD"
            )}{" "}
            |{" "}
            {moment(new Date(currentReport.start_tracking)).add(3,'hours').format("HH:mm:ss")}{" "}
            - {moment(new Date(currentReport.stop_tracking)).add(3,'hours').format("HH:mm:ss")}
          </span>
        </div>
        <div className="dashboard__report_item">
          <span>Camera</span>
          <span>{currentReport.camera.name}</span>
        </div>
        <div className="dashboard__report_item">
          <span>Algorithm</span>

          <span>{currentReport.algorithm.name}</span>
        </div>
        <div className="dashboard__report_item">
          <span>Status</span>
          <span>Not Checked</span>
        </div>
      </div>
    </>
  );
};
