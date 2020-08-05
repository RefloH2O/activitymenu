import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'

import Header from './header'
import Footer from './footer'

import data from '../data.json'

import './layout.css'
import theme from '../theme'

const HeaderBackground = styled.div`
  position: absolute;
  height: 86px;
  width: 100%;
  background-color: ${theme.colors.primary};
  z-index: -1;
`;
const FooterBackground = styled.div`
  position: absolute;
  bottom: 0;
  height: 11rem;
  width: 100%;
  background-color: ${theme.colors.primary};
  z-index: -1;
`;
const Content = styled.div`
  max-width: 960px;
  margin: auto;
  padding: 0 1rem;
  a {
    color: gray;
    text-decoration: underline;
  }
`;
const BackLink = styled.a`
  margin: 35px 0 0;
  display: block;
  font-size: 15px;
  font-weight: 400;
  color: gray;
`;

let layout = (props) => {
  return (
    <div style={{
        position: "relative",
        minHeight:"100vh",
        paddingBottom: "13rem"
      }}>
      <Helmet
        title={props.title + " | "
          + data.title}
        defer={false} />
      <HeaderBackground />
      <Content>
        <Header />
        <BackLink />
        {props.title && (<h2>{props.title}</h2>)}
        {props.children}
      </Content>
      <FooterBackground />
    </div>
  );
};

export default layout;
