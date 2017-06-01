import React from 'react'
import PropTypes from 'prop-types'
import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// slice config
import sliceConfig from '../../../site/t1687/logo/slice'
// util function
import common from '../../../utils/common'

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
  const sliceEle = sliceConfig.map((config) =>
    getSlide(config)
  )
  const settings = {
    dots: true,
    infinite: true,
    speed: 100,
    slidesToShow: 1,
    slidesToScroll: 1
  }
  return (
    <Slider {...settings}>
      {sliceEle}
    </Slider>
  )
}

export const Config = ({ config, increment, doubleAsync }) => (
  <div style={{ margin: '0 auto' }} >
    <h2>Slider</h2>
    {renderSlides()}
  </div>
)
Config.propTypes = {
  config: PropTypes.number.isRequired,
  increment: PropTypes.func.isRequired,
  doubleAsync: PropTypes.func.isRequired,
}

export default Config
