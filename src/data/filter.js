import { combineReducers } from 'redux';

//ACTION CREATORS
function changeFilterTerm(type, term) {
  return { type: "CHANGE_"+type.toUpperCase(), filter: term };
}
function addFilterTerm(type, term) {
  return { type: "ADD_"+type.toUpperCase(), filter: term };
}
function removeFilterTerm(type, term) {
  return { type: "REMOVE_"+type.toUpperCase(), filter: term };
}
function showFilter(value) {
  return { type: "SHOW_FILTER", value };
}

export let actions = {
  changeFilterTerm,
  addFilterTerm,
  removeFilterTerm,
  showFilter
};


//REDUCERS
function category(state = [], action) {
  switch (action.type) {
    case "ADD_CATEGORY":
      return [...state, action.filter];
    case "REMOVE_CATEGORY":
      return state.filter(term => term !== action.filter);
    default:
      return state;
  }
}
function type(state = [], action) {
  switch (action.type) {
    case "ADD_TYPE":
      return [...state, action.filter];
    case "REMOVE_TYPE":
      return state.filter(term => term !== action.filter);
    default:
      return state;
  }
}
function gradeLevel(state = [], action) {
  switch (action.type) {
    case "ADD_GRADE_LEVEL":
      return [...state, action.filter];
    case "REMOVE_GRADE_LEVEL":
      return state.filter(term => term !== action.filter);
    default:
      return state;
  }
}
function points(state = "0-*", action) {
  switch (action.type) {
    case "CHANGE_POINTS":
      return action.filter;
    default:
      return state;
  }
}
function searchTerm(state = "", action) {
  switch (action.type) {
    case "CHANGE_SEARCH_TERM":
      return action.filter;
    default:
      return state;
  }
}
function show(state = false, action) {
  switch (action.type) {
    case "SHOW_FILTER":
      return action.value;
    default:
      return state;
  }
}

//combine reducers
const filter = combineReducers({
  category,
  type,
  gradeLevel,
  points,
  searchTerm,
  showFilter: show
});

export default filter;
