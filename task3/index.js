const express = require('express');
const app = express();
const path = require('path');
const fs = require("fs");
const { parseXML } = require("./chart.js");
const data = fs.readFileSync("crescent.txt");

(async () => {
  await parseXML(data).then(res => fs.writeFileSync("graph.json", JSON.stringify(res)));
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/graph.html'));
  });

  app.get('/graph.json', function (req, res) {
    res.sendFile(path.join(__dirname + '/graph.json'));
  });

  app.get('/index.css', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.css'));
  });

  app.listen(3000, () =>
  console.log('app listening at http://localhost:3000')
  );
})();