import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'

import Header from './header'
import Footer from './footer'
import Banner from './banner'

import data from '../data.json'

import './layout.css'
import theme from '../theme'

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
  text-align: right;
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
        paddingBottom: "25rem"
      }}>
      <Helmet
        title={props.title + " | "
          + data.title}
        defer={false} />
      <Header />
      <Banner src="https://images.squarespace-cdn.com/content/v1/55be6f41e4b06a28979094fc/1532293890933-QZ0DXTO1HI7ELWYAH8Y2/ke17ZwdGBToddI8pDm48kOjCiHQTp4ylhBSliyNWcaMUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcMZfVDM3pZOlP1hLv09trMTqIBdlGYU6-6JHVGZ5qtLQeMuepFjh-7aKXV5o24OS0/Burdick+natives.jpg?format=2500w" />
      <Content>
        <BackLink href="https://www.gscm.refloh2o.com/ecoliteracychallenge">
          {"<-"} Back to the Ecoliteracy Challenge website
        </BackLink>
        {props.title && (<h2>{props.title}</h2>)}
        {props.children}
      </Content>
      <Footer />
    </div>
  );
};

export default layout;
