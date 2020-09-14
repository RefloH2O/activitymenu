import { combineReducers, createStore } from 'redux';
import { actions as filterActions } from './filter';
import filter from './filter';

//ACTION CREATORS
function addActivity(activity) {
  return { type: "ADD_DATUM", activity };
}
function removeActivity(activity) {
  return { type: "REMOVE_DATA", activity };
}
function addActivities(activities) {
  return { type: "ADD_DATA", activities };
}
function setMetadata(metadata) {
  return { type: "SET_METADATA", metadata };
}

export let actions = {...filterActions, addActivity, removeActivity,
  addActivities, setMetadata };

//REDUCERS
function activities(state = [], action) {
  switch (action.type) {
    case "ADD_DATUM":
      return [
        ...state,
        action.activity
      ];
    case "ADD_DATA":
      return [
        ...state,
        ...action.activities
      ];
    case "REMOVE_DATA":
      let activities = state.activities;
      let i = activities.findIndex(action.activity);
      if (i!==-1) activities.splice(i,1);
      return activities;
    default:
      return state;
  }
}
function metadata(state = {"Categories":{}, "Welcome Text": ""}, action) {
  switch (action.type) {
    case "SET_METADATA":
      return action.metadata;
    default:
      return state;
  }
}

//COMBINE REDUCERS
const app = combineReducers({
  activities,
  metadata,
  filter
});

//CREATE STORE
const store = createStore(app);
// store.subscribe(()=>{
//   console.log(store.getState().filter);
// });
export default store;
