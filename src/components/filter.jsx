import React from 'react'
import s from './filter.module.css'

import { connect } from 'react-redux'
import { actions } from '../data/filter'

class Filter extends React.Component {
  constructor () {
    super();
    this.state = {
      categories: [],
      types: []
    }
  }
  componentDidMount() {
    this.setState({
      categories: this.props.categories,
      types: this.props.types
    });
    if (window.innerWidth >= 850)
      this.props.showFilter(true);
  }
  hideFilter() {
    this.props.showFilter(false);
  }
  render() {
    let getPoints = (max, inc) => {
      var ret = [];
      for (var i = 0; i <= max; i+=inc)
        ret.push(i);
      if (max%inc !== 0 ) ret.push(max);
      return ret;
    };
    let getGrades = () => {
      var ret = [{tag:"Pre-K", value:"-1"},{tag:"K", value:"0"}];
      for (var i = 1; i<=12; i++)
        ret.push({tag:i, value:i});
      return ret;
    }
    return (
      <div className={s.container} style={this.props.style}>
        <div className={s.titleContainer}>
          <p className={s.title}>Filter...</p>
          <svg onClick={this.hideFilter.bind(this)} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>
        </div>
        <Search />
        <SubfilterCheckbox name="Track"
          type="CATEGORY"
          options={this.state.categories.slice(0)}
          class={s.categories} />
        <SubfilterCheckbox name="Type"
          type="TYPE"
          options={this.state.types.slice(0)}
          class={s.type} />
        <SubfilterRange name="Number of points"
          type="POINTS"
          options={getPoints(this.props.maxPoints, 5)}
          class={s.points} />
        <SubfilterCheckbox name="Grade level"
          type="GRADE_LEVEL"
          options={getGrades()} diffValues={true}
          class={s.grade} />
      </div>
    );
  }
}

let mapStateFilter = (state) => {
  let style;
  if (state.filter.showFilter)
    style = { left: 0 };
  else
    style = { left: "-100vw" };
  return {style};
};
export default connect(
  mapStateFilter,
  {showFilter: actions.showFilter}
)(Filter);

class SearchUnconnected extends React.Component {
  onChange(e) {
    // console.log(this.props);
    this.props.changeFilterTerm("SEARCH_TERM", e.target.value)
  }
  render() {
    return (
      <div className={s.subfilterWrapper}>
        <p>Search</p>
        <input type="text"
          className={s.searchBox}
          onChange={this.onChange.bind(this)} />
      </div>
    );
  }
}

const Search = connect(
  null,
  {changeFilterTerm: actions.changeFilterTerm}
)(SearchUnconnected);

class SubfilterCheckboxUnconnected extends React.Component {
  constructor() {
    super();
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(e) {
    const term = e.target.name;

    if (e.target.checked) this.props.addFilterTerm(this.props.type, term);
    else this.props.removeFilterTerm(this.props.type, term);
  }
  render() {
    if (this.props.diffValues) {
      return (
        <div className={s.subfilterWrapper}>
          <p>{this.props.name}</p>
          <div className={this.props.class}>
            {this.props.options.map((option) =>
              <div key={option.value} className={s.checkbox}>
                <input type="checkbox"
                  name={option.value}
                  value={option.value}
                  onChange={this.handleInputChange} />
                <span>{option.tag}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return (
      <div className={s.subfilterWrapper}>
        <p>{this.props.name}</p>
        <div className={this.props.class}>
          {this.props.options.length === 0 ?
            (<span>Loading...</span>)
            : this.props.options.map((option) =>
            <div key={option} className={s.checkbox}>
              <input type="checkbox"
                name={option}
                value={option}
                onChange={this.handleInputChange} />
              <span>{option}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
}
const SubfilterCheckbox = connect(
  null, {...actions}
)(SubfilterCheckboxUnconnected);

class SubfilterRangeUnconnected extends React.Component {
  constructor() {
    super();
    this.state = {
      min: "0",
      max: "*"
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(e) {
    let term = "";
    if (e.target.name === "min"){
      this.setState({min: e.target.value});
      term = e.target.value+"-"+this.state.max;
    }
    if (e.target.name === "max"){
      this.setState({max: e.target.value});
      term = this.state.min+"-"+e.target.value;
    }
    this.props.changeFilterTerm(this.props.type,term);
  }
  render() {
    return (
      <div className={s.subfilterWrapper}>
        <p>{this.props.name}</p>
        <div className={this.props.class}>
          <span>min</span>
          <select onChange={this.handleInputChange} name="min">
            {this.props.options.map((option) =>
              <option key={option} value={option}>{option}</option>
            )}
          </select>
          <span>max</span>
          <select onChange={this.handleInputChange} name="max">
            {this.props.options.map((option) =>
              <option key={option} value={option}>{option}</option>
            )}
          </select>
        </div>
      </div>
    );
  }
}

const SubfilterRange = connect(
  null, {...actions}
)(SubfilterRangeUnconnected);
