import React from 'react'
import data from '../data.json'
import styled from 'styled-components'

import theme from '../theme'

const StyledFooter = styled.footer`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  color: rgba(0,0,0,.7);
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 15rem;
  padding: 4rem 0;
  justify-content: space-between;
  box-sizing: border-box;
  text-align: center;
  a, a:visited {
    color: #3d9991;
    text-decoration: underline;
  }
  span {
    font-family: proxima-nova;
    font-size: 12px;
    letter-spacing: 2px;
    margin-left: 1em;
    color: rgba(122,122,122,.8);
  }
  div {
    width: 100%;
  }
  p {
    color: rgba(122,122,122,.8);
    line-height: 1.6em;
  }
  div > span:first-child { margin: 0; }
  div > a { text-decoration: none; color: unset; }
  p > a { color: unset; }
  @media only screen and (max-width: 850px) {
    padding: 20px;
    height: 20rem;
    div {
      span {
        display: block;
        margin: 0;
        line-height: 1.6em;
      }
    }
  }
`;

const Footer = (props) => {
  return (
    <StyledFooter>
      <strong>For questions or additional information, please contact <a href="mailto:lisa.neeb@refloh2o.com">Lisa Neeb</a>.</strong>
      <div><span class="site-address">Reflo, Inc - A 501(c)3 Company, Milwaukee, Wisconsin</span><span rel="tel" class="site-phone">414-949-7356</span><a href="mailto:admin@refloh2o.com" class="site-email"><span>admin@refloh2o.com</span></a></div>
      <p>The Green Schools Consortium of Milwaukee and its website are managed by the nonprofit <a href="http://refloh2o.com">Reflo</a>.</p>
    </StyledFooter>
  )
}

export default Footer
