import {SliderWrap} from "./swiper.style";
// styled-component wrap
import {Swiper, SwiperSlide} from 'swiper/react';
// SwiperSlide is pretty self-explantory. it is one slide that would contain
// one of data you want to show
import SwiperCore, {Navigation, Pagination, EffectFade, Autoplay } from "swiper";

// install Swiper modules
SwiperCore.use([Navigation, Pagination, EffectFade, Autoplay]);

const Slider = ({children, settings}) => {
  const sliderOptions = {
    slidesPerView: 1,
    pagination: true,
    navigation: true,
    loop: true
  };

  return (
    <SliderWrap
      dots={sliderOptions?.pagination}
      arrows={sliderOptions?.navigation}
      // I pass dots and arrow props to custom pagination and navigation in styled-component
    >
      <Swiper
        {...sliderOptions}
      >
        {children}
      </Swiper>
    </SliderWrap>
  );
};

export {SwiperSlide as Slide};
export default Slider;