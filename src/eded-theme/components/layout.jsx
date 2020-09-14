import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'

import Header from './header'
import Footer from './footer'
import Banner from './banner'

import { connect } from 'react-redux'

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
          + props.metadata.Title}
        defer={false} />
      <Header />
      <Banner src={props.metadata["Banner Image"]} />
      <Content>
        <BackLink href={props.metadata["Home URL"]}>
          {"<-"} Back to the Ecoliteracy Challenge website
        </BackLink>
        {props.title && (<h2>{props.title}</h2>)}
        {props.children}
      </Content>
      <Footer />
    </div>
  );
};

export default connect(
  (state)=>{return {metadata: state.metadata};},
  null
)(layout);
