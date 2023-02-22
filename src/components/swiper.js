import { API_IMAGES_I } from "../api/api.js";
import { getIsInternet } from "../api/getURL";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

export const Slider = ({currentReport, setFullImage} ) => {
    
    return (
        <>
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
        </>
    )
}