import React from 'react'
import PropTypes from 'prop-types'
import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// server config
import sliderConfig from '../../../site/t1687/logo/slice'
import docConfig from '../../../site/t1687/doc/aboutus'
import common from '../../../utils/common'
import './Slider.scss'

const preloadjs = `<script type="text/javascript" src="/inc/configPath.js"></script>
<script type="text/javascript" src="/inc/sninfo.js"></script><script type="text/javascript">
bgPage.loadLogin();</script>`
const preloadjsTemplate = { __html: preloadjs }

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
    getSlide(config),
  )
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    lazyLoad: 'ondemand',
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }
  return (
    <div className='sliderContainer'>
      <Slider {...settings}>
        {sliderElement}
      </Slider>
    </div>
  )
}

const renderAbout = () => {
  const { id, contentZh } = docConfig[0]
  const content = common.bs64Decode(contentZh)
  var template = { __html: content }

  return (
    <div className='help-block' dangerouslySetInnerHTML={template} />
  )
}

const importPreloadjs = () => (
  <div dangerouslySetInnerHTML={preloadjsTemplate} />
)

export const Slides = () => (
  <div style={{ margin: '0 auto' }} >
    <div className='container'>
      <div>
        <h2>Slider</h2>
        {renderSlides()}
      </div>
      <div>
        <h2>About Us</h2>
        {renderAbout()}
      </div>
    </div>
    {importPreloadjs()}
  </div>
)

export default Slides
