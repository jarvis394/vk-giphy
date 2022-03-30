import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import Popup from '.'
import gf from 'src/config/giphyFetch'

const GIF = () => {
  // const [data] = useState()
  // gf.search('cat').then((d) => console.log('data:', d))
  const data = {
    height: 200,
    mp4: 'https://media0.giphy.com/media/BzyTuYCmvSORqs1ABM/200.mp4?cid=362220f2s2iwl57p15yojfbten52y0vx386fr21zksxaygyu&rid=200.mp4&ct=g',
    mp4_size: '119633',
    size: '412165',
    url: 'https://media0.giphy.com/media/BzyTuYCmvSORqs1ABM/200.gif?cid=362220f2s2iwl57p15yojfbten52y0vx386fr21zksxaygyu&rid=200.gif&ct=g',
    webp: 'https://media0.giphy.com/media/BzyTuYCmvSORqs1ABM/200.webp?cid=362220f2s2iwl57p15yojfbten52y0vx386fr21zksxaygyu&rid=200.webp&ct=g',
    webp_size: '187454',
    width: 200,
  }
  return (
    <Popup>
      <picture>
        <source type="image/webp" srcSet={data.webp} />
        <img src={data.url} alt="" />
      </picture>
    </Popup>
  )
}

export default GIF
