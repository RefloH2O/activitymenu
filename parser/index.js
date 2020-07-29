const cheerio = require('cheerio')
const Turndown = require('turndown'),
      td = new Turndown()
const fs = require('fs')

const files = fs.readdirSync('activities');

let data = [];

files.forEach((file) => {
  console.log(`Importing HTML from ${file}`);
  let procs = processFile(file);
  switch (file.slice(2,-5)) {
    case "curric":
      procs = procs.map(x => Object.assign(x,{type:"Curriculum"}))
      break;
    case "ft":
      procs = procs.map(x => Object.assign(x,{type:"Field Trip"}))
      break;
    case "init":
      procs = procs.map(x => Object.assign(x,{type:"School Initiative"}))
      break;
    case "pres":
      procs = procs.map(x => Object.assign(x,{type:"Classroom Presentation"}))
      break;
    default:
      procs = procs.map(x => Object.assign(x,{type:""}))
  }
  data = data.concat(procs);
})

console.log(`Extracted data successfully.`);
fs.writeFileSync('activities.json', JSON.stringify(data), 'utf8');

console.log(`Now eliminating duplicates.`);
data.sort((a,b)=>{return (a.title < b.title) ? -1 : 1});

console.log(`Now converting and saving to CSV.`);

fs.writeFileSync('activities.csv', 'Title,Link,Grade,Contact,Points,Description,Cost,Type,Standards Connections,Tracks\n');

let writeStream = fs.createWriteStream('activities.csv', {flags:'a'});
data.forEach((line) => {
  let final = `"${line.title.replace(/"/g,'""')}",`;
  final = final + `"${line.link.replace(/"/g,'""')}",`;
  final = final + `"${line.grade.replace(/"/g,'""')}",`;
  if (line.contact)
    final = final + `"${line.contact.replace(/"/g,'""')}",`;
  else
    final = final + `,`;
  final = final + `"${line.pointsText.replace(/"/g,'""')}",`;
  final = final + `"${line.description.replace(/"/g,'""')}",`;
  if (line.costText)
    final = final + `"${line.costText.replace(/"/g,'""')}",`;
  else
    final = final + `,`;
  final = final + `"${line.type.replace(/"/g,'""')}",`;
  if (line.standards)
    final = final + `"${line.standards.replace(/"/g,'""')}",`;
  else
    final = final + `,`;
  if (line.tracks)
    final = final + `"${line.tracks.replace(/"/g,'""')}"`;
  writeStream.write(final+"\n");
});

writeStream.end();
console.log(`Successfully saved activities to activities.csv.`);


//file process function
function processFile(source) {

  let data = fs.readFileSync("activities/"+source, 'utf8');
  let divs = [];
  let procs = [];

  let x = 0;
  cheerio(data).each((i, elem)=>{
    if (cheerio(elem, data).html() !== null) {
      x++;
      divs.push(cheerio(elem, data).html());
    }
  });
  for (let i = 0; i < divs.length-1; i+=2) {
    procs.push(processDiv(cheerio(':root > div', divs[i]).last().html()));
  }

  return procs;
};

//div parse function
function processDiv(data) {
  const $ = cheerio.load(data);
  let extracted = {};
  const lines = $('p').html().split('<br>');

  for (var i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (i == 0) { //title seq
      extracted.title = cheerio(line).text();
      if (/^<a /.test(line)) extracted.link = cheerio('a', line).attr('href')
      else extracted.link = '';
      if (/^\//.test(extracted.link))
        extracted.link = "https://www.gscm.refloh2o.com" + extracted.link;
    } else if (i == 1) { //grade seq
      extracted.grade = cheerio(line).text().split(': ')[1];
    } else {
      let lineSplit = cheerio(line).text().split(': ');
      switch (lineSplit[0]) {
        case 'Contact':
          let html = line.split('</strong>')[1].trim();
          if (/: /.test(html)) html = html.split(': ')[1];
          extracted.contact = td.turndown(html);
          break;
        case 'Cost':
        case 'Costs':
          extracted.costText = lineSplit[1].trim();
          break;
        case 'Points':
          extracted.pointsText = lineSplit[1].trim();
          break;
        case 'Standards Connections':
        case 'Standards':
          // TODO: extract simpler standards as spec'd in email w/ reflo
          extracted.standards = lineSplit[1].trim();
          break;
        case 'Tracks':
          extracted.tracks = lineSplit[1].trim();
          break;
        default:
          if (extracted.description)
            extracted.description
              = extracted.description + "\n" + td.turndown(line);
          else
            extracted.description
              = td.turndown(line);
          break;
      }
    }
  }

  return extracted;
}
