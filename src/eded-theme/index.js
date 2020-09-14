import csv from 'neat-csv'

export {default as Header} from './components/header'
export {default as Footer} from './components/footer'
export {default as Layout} from './components/layout'
export {default as theme} from './theme'

async function loadMetadata() {
  let url = "https://docs.google.com/spreadsheets/d/184hqQs8x2uGcsbbRWoROo6t2mXOKU1BKgomFZV8g0jk/gviz/tq?tqx=out:csv&sheet=tracks+and+metadata";
  let raw = await fetch(url);
  let body = await raw.text();
  // TODO: see if can take out raw and simplify
  let parsed = await csv(body,{headers:false});
  let reachedCategories = false;
  let data = {"Categories":{}, loaded: true};
  for (let line of parsed) {
    console.log("working on "+JSON.stringify(line))
    if (line[0] === "SKIP") continue;
    if (line[0] === "Categories") {
      reachedCategories = true;
      continue;
    }
    //process actual line
    if (reachedCategories) data.Categories[line[0]] = line[1]
    else data[line[0]] = line[1]
  }
  console.log(data);
  return data;
}

export {loadMetadata}
