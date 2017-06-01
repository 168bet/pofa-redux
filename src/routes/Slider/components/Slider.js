import React from 'react'
import PropTypes from 'prop-types'
import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// server config
import sliderConfig from '../../../site/t1687/logo/slice'
import common from '../../../utils/common'
import './Slider.scss'

const getSlide = config => {
  const { filePathZh, id } = config
  const imgUrl = common.bs64Decode(filePathZh)
  return (
    <div key={id} >
      <img src={imgUrl} />
    </div>
  )
}

const renderSlides = () => {
  const sliderElement = sliderConfig.map((config) =>
    getSlide(config)
  )
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    lazyLoad: 'ondemand',
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  }
  return (
    <div className='sliderContainer'>
      <Slider {...settings}>
        {sliderElement}
      </Slider>
    </div>
  )
}

export const Slides = () => (
  <div style={{ margin: '0 auto' }} >
    <h2>Slider</h2>
    {renderSlides()}
  </div>
)

export default Slides
