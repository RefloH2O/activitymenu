import React from 'react'
import { Layout } from '../eded-theme'
import Filter from '../components/filter'
import Activities from '../components/activities'

import MarkdownIt from 'markdown-it'
import { data } from '../eded-theme'

import styled from 'styled-components'
import s from './index.module.css'

import { connect } from 'react-redux'
import { actions } from '../data/app'

import stream from 'stream'
import csv from 'csv-parser'

let FilterButton = styled.button`
  margin: 0 0 1rem 8px;
  font-family: Roboto;
  font-size: 1.3rem;
  font-style: italic;
  color: #fff;
  border: none;
  background-color: #5A5A5A;
  border-radius: 10px;
  padding: 4px 25px;
  display: none;
  @media only screen and (max-width: 850px) {
    display: block;
  }
`;
let WelcomeText = styled.p`
  p {
    margin-bottom: 1rem;
  }
`;

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {
        categories: [],
        types: [],
        points: {
          min: 0,
          max: 0
        }
      }
    };
  }
  handleActivityData(raw) {
    let s = new stream.Readable();
    console.log("activity data received, now loading...");
    s._read = () => {};
    s.push(raw);
    s.push(null);
    s.pipe(csv())
      .on('data', (data) => {
        //fix category and type data
        data["Category"] = data["Tracks"].split(', ');
        data["Type"] = data["Type"].split(', ');
        data["Organization ID"] = data["Organization ID"].split(', ');
        data["Points String"] = data["Points"];
        data["Grade String"] = data["Grade"];
        data["Grade"] = data["Grade"].split('-');
        data["Grade"][0] = data["Grade"][0]
          .replace(/PreK/,'-1')
          .replace(/K3/,'-2')
          .replace(/K/,'0');
        if (data["Grade"].length > 1)
          data["Grade"][1] = data["Grade"][1]
            .replace(/PreK/,'-1')
            .replace(/K3/,'-2')
            .replace(/K/,'0');
        data["Points"] = data["Points"] === "varies" ? "*"
          : data["Points"].split("/")[0];

        //add to activity cache
        this.activities.push(data);
     })
       .on('end', () => {
          console.log("done loading activity data!");
          console.log("now processing...")
          var state = this.state;
          //loop through activities and get general data
          for (let data of this.activities) {
            //add categories
            for (var cat of data["Category"]) {
              if(!state.data.categories.includes(cat) && cat !== "")
                state.data.categories.push(cat);
            }
            //add types
            for (var type of data["Type"]) {
              if(!state.data.types.includes(type))
                state.data.types.push(type);
            }
            //update max points
            if(state.data.points.max < data["Points"])
              state.data.points.max = data["Points"];
          }
          console.log("done dynamically getting categories + types...");
          //update state
          this.setState(state);

          console.log("done processing activities for 'all' category!");
          console.log("now getting organization data...");

          //send organizationrequest here
          this.organizationrequest.send();
     });
  }
  handleOrganizationData(raw) {
    console.log("received organization data, now loading...");
    this.organizations = [];

    let s2 = new stream.Readable();
    s2._read = () => {};
    s2.push(raw);
    s2.push(null);
    s2.pipe(csv())
      .on('data', data => {
        this.organizations.push(data);
      })
      .on('end', () => {
        console.log("done loading organization data!");

        console.log("now processing activities with organization data...");
        for (let act of this.activities){
          //Give organization link and image url
          act["Organization"] = act["Organization ID"]
            .map(id => {
              return {
                "Name": this.organizations[id].Name,
                "Image": 'img/orgs/id'+id,
                "Link": this.organizations[id].Link
              };
            });
        };
        console.log("done processing all activities!");

        console.log("adding each to store...");
        //add to store
        this.props.addActivities(this.activities);
        console.log("done adding activities to store!");

        console.log("activities should now be loaded.");
      });
  }
  componentDidMount() {
    var url = "https://docs.google.com/spreadsheets/d/184hqQs8x2uGcsbbRWoROo6t2mXOKU1BKgomFZV8g0jk/gviz/tq?tqx=out:csv&sheet=activities";

    this.activities = [];

    //activity request
    if (!url) {
      let state = this.state;
      console.log("Error: URL for activities data not found");
      state.error = "Error: URL for activities data not found";
      this.setState(state);
      return;
    }
    this.activityrequest = new XMLHttpRequest();
    this.activityrequest.open("GET", url);
    this.activityrequest.onreadystatechange = (e) => {
      var req = this.activityrequest;
      if (req.readyState === 4)
        if (req.status === 200) {
          this.handleActivityData(req.responseText);
        } else {
          console.log("Error with activity request: "+req.status);
          console.log(req.statusText);
          this.setState({error: "Error: "+req.statusText});
          return;
        }
    };
    this.activityrequest.onreadystatechange.bind(this);

    //prepare organization data request
    var orgurl = "https://docs.google.com/spreadsheets/d/184hqQs8x2uGcsbbRWoROo6t2mXOKU1BKgomFZV8g0jk/gviz/tq?tqx=out:csv&sheet=organizations";

    if (!orgurl) {
      let state = this.state;
      console.log("Error: URL for organization data not found");
      state.error = "Error: URL for organization data not found";
      this.setState(state);
      return;
    }
    this.organizationrequest = new XMLHttpRequest();
    this.organizationrequest.open("GET", orgurl);
    this.organizationrequest.onreadystatechange = (e) => {
      var req = this.organizationrequest;
      if (req.readyState === 4)
        if (req.status === 200) {
          this.handleOrganizationData(req.responseText);
        } else {
          console.log("Error with organization request: "+req.status);
          console.log(req.statusText);
          this.setState({error: "Error: "+req.statusText});
          return;
        }
    };
    this.organizationrequest.onreadystatechange.bind(this);

    //send activity data request
    console.log("sending activity request...");
    this.activityrequest.send();
  }
  showFilter() {
    // console.log(actions);
    this.props.showFilter(true);
  }
  render() {
    let md = new MarkdownIt({typographer: true});
    return (
      <Layout title={"Activity Menu"}>
        <WelcomeText className={s.description}
          dangerouslySetInnerHTML={{
            __html: md.render(data["Welcome Text"])
          }} />
        <div className={s.wrapper}>
          <FilterButton onClick={this.showFilter.bind(this)}>Filter...</FilterButton>
          <Filter
            categories={this.state.data.categories}
            types={this.state.data.types}
            maxPoints={this.state.data.points.max}/>
          <Activities />
        </div>
      </Layout>
    );
  }
}

export default connect(
  null,
  {
    addActivities: actions.addActivities,
    showFilter: actions.showFilter
  }
)(Index);
