import React from 'react'
import { connect } from 'react-redux'
import MarkdownIt from 'markdown-it'

import s from './activities.module.css'
import { data } from '../eded-theme'

class Activities extends React.Component {
  render () {
    return (
      <div className={s.main}>
        {this.props.activities.map((activity)=>{
          return (
            <Activity key={activity.Title}
              title={activity.Title}
              link={activity.Link}
              org={activity.Organization}
              grade={activity["Grade"]}
              gradestring={activity["Grade String"]}
              type={activity.Type}
              points={activity.Points}
              pointstring={activity["Points String"]}
              description={activity.Description}
              cost={activity.Cost}
              contact={activity.Contact}
              standards={activity["Standards Connections"]}
              categories={activity.Category} />
          );
        })}
      </div>
    );
  }
}

class Activity extends React.Component {
  static defaultProps = {categories: []}
  render() {
    let md = new MarkdownIt({typographer: true});
    let gradeString = "";
    if (this.props.gradestring) {
      gradeString = this.props.gradestring.includes("-") ?
      "Grades "+this.props.gradestring
      : "Grade "+this.props.gradestring;
    }
    let typeString = "";
    if (this.props.type) {
      for (let i of this.props.type)
        typeString = typeString+", "+i;
    }
    let pointString = "Points vary";
    if (this.props.points && this.props.points !== "*")
      if (this.props.pointstring.includes('/')) {
        let arr = this.props.pointstring.split('/');
        pointString = arr[0]+" points per "+arr[1];
      }
      else pointString = this.props.points + " points";
    return (
      <div className={s.activity} ref={this.ref}>
        <div>
          {this.props.org.map((orgObj) => {
            return (
              <a href={orgObj.Link}>
                <img src={orgObj.Image} alt={orgObj.Name} />
              </a>
            );
          })}
        </div>
        <div className={s.infoContainer}>
          {this.props.link ? (<a href={this.props.link}><h4>{this.props.title}</h4></a>) : (<h4>{this.props.title}</h4>)}
          <p>{gradeString}{typeString}</p>
          <p className={s.activityPoints}>{pointString}</p>
          <div className={s.pillContainer}>
            {this.props.categories.map((cat)=>{
              return (
                <Pill key={cat} name={cat} />
              );
            })}
          </div>
          <div className={s.description}
            dangerouslySetInnerHTML={{
              __html: md.render(this.props.description)
            }} />
          {this.props.cost &&
            <div className={s.contact}>
              <b>Cost:</b> <span className={s.contact}
                dangerouslySetInnerHTML={{
                  __html: md.renderInline(this.props.cost)
                }} />
            </div>}
          {this.props.standards &&
            <div className={s.contact}>
              <b>Standards Connections:</b> <span className={s.contact}>{this.props.standards}</span>
            </div>}
          {this.props.contact &&
            <div className={s.contact}>
              <b>Contact:</b> <span className={s.contact}
                dangerouslySetInnerHTML={{
                  __html: md.renderInline(this.props.contact)
                }} />
            </div>}
        </div>
      </div>
    );
  }
}

const Pill = (props) => {
  return (
    <div className={s.pill} style={{
        backgroundColor: data.categories[props.name]
      }}>
      {props.name}
    </div>
  )
}


let mapFilteredActivities = (state) => {
  let activities = state.activities.slice(0);

  //Filter categories
  if (state.filter.category.length !== 0){
    let cat;
    let filterFunc = (act) => {
      return act["Category"].includes(cat);
    };
    for (cat of state.filter.category)
      activities = activities.filter(filterFunc);
  }

  //Filter types
  if (state.filter.type.length !== 0){
    let type;
    let filterFunc = act => {
      return act["Type"].includes(type);
    };
    for (type of state.filter.type)
      activities = activities.filter(filterFunc);
  }

  //Filter points
  let points = state.filter.points.split("-");
  activities = activities.filter((act) => {
    if (points[1] === "*")
      return act.Points >= parseInt(points[0]) || act.Points === "*" || act.Points === "";
    else if (act.Points === "*") return true;
    else return act.Points >= parseInt(points[0]) && act.Points <= parseInt(points[1]);
  });

  //Filter grade level
  if (state.filter.gradeLevel.length !== 0){
    let filteredActivities = [];
    let grade;
    let filterFunc = act => {
      if (filteredActivities.includes(act)) return false;
      return parseInt(act["Grade"][0]) <= parseInt(grade)
        && parseInt(grade) <= parseInt(act["Grade"][1]);
    };
    for (grade of state.filter.gradeLevel)
      filteredActivities = [
        ...filteredActivities,
        ...activities.filter(filterFunc)
      ];
    activities = filteredActivities;
  }

  //Filter search term
  let search = state.filter.searchTerm.toLowerCase().trim().split(" ");
  if (search[0] !== ""){
    activities.map(a => {a.relevance = 0; return a;});
    let filteredActivities = [];
    let term;
    let filterFunc = (act, i) => {
      if (!act.relevance) act.relevance = 0;
      if (act.Title.toLowerCase().includes(search.join(' '))){
        act.relevance+=50;
      }
      for (let org of act.Organization) {
        if (org.Name.toLowerCase().includes(search.join(' '))){
          act.relevance+=2
        }
      }
      if (act.Description.toLowerCase().includes(search.join(' ')))
        act.relevance+=30;
      act.relevance +=
        (act.Title
          .toLowerCase()
          .match(new RegExp(term,'g')) || []).length;
      act.relevance +=
        (act.Description
          .toLowerCase()
          .match(new RegExp(term,'g')) || []).length;

      if (!filteredActivities.includes(act) && act.relevance > 0) {
        return true;
      }
      return false;
    }
    for (term of search)
      filteredActivities = [
        ...filteredActivities,
        ...activities.filter(filterFunc)
      ]
    activities = filteredActivities;

    //Return filtered activities, sorted by relevance
    let sortFunction = (a,b)=>{
      if (a.relevance > b.relevance) return -1;
      else if (a.relevance < b.relevance) return 1;
      else {
        let varA = a.Title.toLowerCase();
        let varB = b.Title.toLowerCase();
        if (varA < varB) return -1;
        else if (varA > varB) return 1;
        else return 0;
      };
    };
    activities = activities.sort(sortFunction)
    return { activities };
  }

  //Return filtered activities
  let sortFunction = (a,b)=>{
    let varA = a.Title.toLowerCase();
    let varB = b.Title.toLowerCase();
    if (varA< varB) return -1;
    else if (varA> varB) return 1;
    else return 0;
  };
  activities = activities.sort(sortFunction)
  return { activities };
};

export default connect(
  mapFilteredActivities,
  null
)(Activities);
