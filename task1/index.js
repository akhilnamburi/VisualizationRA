var express = require("express");
var app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/views"));

var fs = require("fs");
const path = require("path");
var folder = path.join(__dirname, "text/");
const { parseXML } = require("./chart.js");
const txtData = fs.readFileSync("crescent.txt");
const htmlToImage = require('html-to-image');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const bodyParser = require('body-parser');

async function readFiles(dirname, onFileContent, onError) {
  filenames = fs.readdirSync(dirname);

  filenames.forEach(function(filename) {
    content = fs.readFileSync(dirname + filename, "utf-8");
    onFileContent(filename, content);
  });
}

var data = {};
readFiles(
  folder,
  function(filename, content) {
    data[filename] = content;
  },
  function(err) {
    throw err;
  }
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.get("/", async (req, res) => {
  res.render("index", { files: data });
});

app.get("/readFile/:name", (req, res) => {
  res.send(data[req.params.name]);
});

app.get("/getAllData", (req, res) => {
  parseXML(txtData).then(parsedData => {
    fs.writeFileSync("graph.json", JSON.stringify(parsedData));
    const dom = new JSDOM(fs.readFileSync(path.join(__dirname + '/graph.html')));
    const $document = dom.window.document;
    const content = $document.createElement('div');
    
    content.classList.add('matrix-content');
    res.send('<div class="container" >  <div></div>  <div id="top"></div></div><div class="container">  <div id="side"></div>  <div id="matrix"></div></div>↵<svg  width="1920"  height="1080"  viewBox="0 0 1920 1080"  preserveAspectRatio="xMidYMid meet"></svg>');
  });
});

app.listen(port, () =>
  console.log(`app listening at http://localhost:${port}`)
);
