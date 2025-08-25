import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image1 from "../assets/images/slide1.png";
import Image2 from "../assets/images/slide2.png";
import Image3 from "../assets/images/slide3.jpg";


export default function ImageSlider() {
  const images = [
    Image1,
    Image2,
    Image3
  ]
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        autoplay={{ delay: 3000 }}
        loop={true}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-[400px] flex items-center justify-center bg-white rounded-lg overflow-hidden">
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
