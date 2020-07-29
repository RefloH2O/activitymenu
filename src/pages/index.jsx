import React from 'react'
import csv from 'csv-parser'
import stream from 'stream'

class Index extends React.Component {
  constructor () {
    super();
    this.state = {
      data: {
        tracks: [],
        types: [],
      }
    };
  }
  handleActivityData (raw) {
    let s = new stream.Readable();
    console.log("activity data received, now loading...");
    s._read = () => {};
    s.push(raw);
    s.push(null);
    s.pipe(csv())
      .on('data', (data) => {
        //fix category and type data
        data["Tracks"] = data["Tracks"].split(',');
        data["Type"] = data["Type"].split(',');

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
            for (var cat of data["Tracks"]) {
              if(!state.data.tracks.includes(cat))
                if(cat !== "All")
                  state.data.tracks.push(cat);
            }
            //add types
            for (var type of data["Type"]) {
              if(!state.data.types.includes(type))
                state.data.types.push(type);
            }
            //update max points
            // if(state.data.points.max < data["Points"])
            //   state.data.points.max = data["Points"];
          }
          console.log("done dynamically getting categories + types...");
          //update state
          this.setState(state);
          console.log(this.activities);

          // console.log("now processing activities again for 'all' category...");
          // for (let data of this.activities) {
          //   //fix category "All";
          //   if (data["Category"].includes("All"))
          //     data["Category"] = this.state.data.categories.slice(0);
          // }

          // console.log("done processing activities for 'all' category!");
          // console.log("now getting organization data...");
          //
          // //send organizationrequest here
          // this.organizationrequest.send();
     });
  }
  componentDidMount () {
    this.activities = [];

    let url = "https://docs.google.com/spreadsheets/d/11TpeYnLDwCISt_4_iyQimpXKumuxOF4MPSSMBwBY5M0/gviz/tq?tqx=out:csv&sheet=activities";
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
    this.activityrequest.send();
  }
  render () {
    let acts = this.activities;
    return <div>
      {acts ? acts.map(act => (
        <div>
          <h3>{act.Title}</h3>
          {act.Contact !== "" ? (<p><b>Contact:</b> {act.Contact}</p>) : ""}
          <p>{act.Description}</p>
        </div>
      )) : ""}
    </div>;
  }
}

export default Index;
