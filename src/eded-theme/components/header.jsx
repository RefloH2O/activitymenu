import React from 'react'
import data from '../data.json'
import styled from 'styled-components'

import logo from '../img/gscm.png'

const StyledHeader = styled.header`
  font-family: 'Oswald';
  height: 86px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  * {
    font-weight: 400;
  }
  h1 {
    font-size: 22px;
    color: #004566;
  }
  a {
    text-decoration: none !important;
    display: block;
    line-height: 0;
  }
  img {
    width: 140px;
    margin: 20px
  }

  @media only screen and (max-width: 850px) {
    height: unset;
  }
`;

const Header = (props) => {
  return (
    <StyledHeader>
      <a href="https://gscm.refloh2o.com">
        <img src={logo} alt={"SFUSD Sustainability Logo"} />
      </a>
    </StyledHeader>
  )
}

export default Header
