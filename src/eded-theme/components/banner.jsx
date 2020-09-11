import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
`;
const Overlay = styled.div`
  background-color: rgba(255,255,255,.4);
  position: absolute;
  z-index: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;
const Img = styled.img`
  height: 260px;
  width: 100%;
  object-fit: cover;
  @media only screen and (max-device-height: 768px) {
    height: 120px;
  }
  @media only screen and (max-device-height: 640px) {
    height: 80px;
  }
`;

class Banner extends React.Component {
  render () {
    return <Wrapper>
      <Overlay />
      <Img src={this.props.src} />
    </Wrapper>;
  }
}

export default Banner;
