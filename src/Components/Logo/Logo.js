import React from 'react'
import Tilt from 'react-parallax-tilt'
import circuit from './circuit.png'

const Logo = () => {
  return (
    <div style={{ height: '150px', width: '150px' }} className='ma4 mt0'>
      <Tilt>
        <div style={{ backgroundColor: 'darkgreen' }}>
          <h1>
            <img alt='Logo' src={circuit} />
          </h1>
        </div>
      </Tilt>
    </div>
  )
}

export default Logo
