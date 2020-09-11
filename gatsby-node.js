const request = require('request');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});
const dataURL = "https://docs.google.com/spreadsheets/d/184hqQs8x2uGcsbbRWoROo6t2mXOKU1BKgomFZV8g0jk/gviz/tq?tqx=out:csv&sheet=organizations";

exports.onPreInit = (() => {
  //clear org img directory
  const orgpath = 'public/img/orgs/';
  if (fs.existsSync(orgpath))
    fs.readdir(orgpath, (err, files) => {
      if (err) throw err;
      for (const file of files)
        fs.unlinkSync(path.join(orgpath, file));
    });
  else fs.mkdirSync(orgpath,{recursive: true});

  request(dataURL)
    .pipe(csv())
    .on('data', org => {
      //download image
      request({
        url: "https://drive.google.com/uc?export=view&id="
          + org["Photo ID in Google Drive"],
        method: 'GET'
      })
        .pipe(fs.createWriteStream(
          orgpath+'id'+org["ID"],
          {encoding: 'binary'}
        ));
    })
    .on('end', () => {
      //do something
      console.log('Organization images written to '+orgpath);
    });
});

exports.onCreateWebpackConfig = ({
  stage,
  rules,
  loaders,
  plugins,
  actions,
}) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "styled-components": path.resolve("node_modules","styled-components"),
      }
    }
  });
};
