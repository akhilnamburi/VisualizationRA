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
const XmlReader = require('xml-reader');
const xmlQuery = require('xml-query');
const xmlRead = require('read-xml');
const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'google',
  apiKey: 'AIzaSyBFte7gk7AkuitEPovpnMEqbQUF8RKJktY'
};
const geocoder = NodeGeocoder(options);
const ObjectsToCsv = require('objects-to-csv');

const CONTINENTS = {
  "AD": "Europe",
  "AE": "Asia",
  "AF": "Asia",
  "AG": "North America",
  "AI": "North America",
  "AL": "Europe",
  "AM": "Asia",
  "AN": "North America",
  "AO": "Africa",
  "AQ": "Antarctica",
  "AR": "South America",
  "AS": "Australia",
  "AT": "Europe",
  "AU": "Australia",
  "AW": "North America",
  "AZ": "Asia",
  "BA": "Europe",
  "BB": "North America",
  "BD": "Asia",
  "BE": "Europe",
  "BF": "Africa",
  "BG": "Europe",
  "BH": "Asia",
  "BI": "Africa",
  "BJ": "Africa",
  "BM": "North America",
  "BN": "Asia",
  "BO": "South America",
  "BR": "South America",
  "BS": "North America",
  "BT": "Asia",
  "BW": "Africa",
  "BY": "Europe",
  "BZ": "North America",
  "CA": "North America",
  "CC": "Asia",
  "CD": "Africa",
  "CF": "Africa",
  "CG": "Africa",
  "CH": "Europe",
  "CI": "Africa",
  "CK": "Australia",
  "CL": "South America",
  "CM": "Africa",
  "CN": "Asia",
  "CO": "South America",
  "CR": "North America",
  "CU": "North America",
  "CV": "Africa",
  "CX": "Asia",
  "CY": "Asia",
  "CZ": "Europe",
  "DE": "Europe",
  "DJ": "Africa",
  "DK": "Europe",
  "DM": "North America",
  "DO": "North America",
  "DZ": "Africa",
  "EC": "South America",
  "EE": "Europe",
  "EG": "Africa",
  "EH": "Africa",
  "ER": "Africa",
  "ES": "Europe",
  "ET": "Africa",
  "FI": "Europe",
  "FJ": "Australia",
  "FK": "South America",
  "FM": "Australia",
  "FO": "Europe",
  "FR": "Europe",
  "GA": "Africa",
  "GB": "Europe",
  "GD": "North America",
  "GE": "Asia",
  "GF": "South America",
  "GG": "Europe",
  "GH": "Africa",
  "GI": "Europe",
  "GL": "North America",
  "GM": "Africa",
  "GN": "Africa",
  "GP": "North America",
  "GQ": "Africa",
  "GR": "Europe",
  "GS": "Antarctica",
  "GT": "North America",
  "GU": "Australia",
  "GW": "Africa",
  "GY": "South America",
  "HK": "Asia",
  "HN": "North America",
  "HR": "Europe",
  "HT": "North America",
  "HU": "Europe",
  "ID": "Asia",
  "IE": "Europe",
  "IL": "Asia",
  "IM": "Europe",
  "IN": "Asia",
  "IO": "Asia",
  "IQ": "Asia",
  "IR": "Asia",
  "IS": "Europe",
  "IT": "Europe",
  "JE": "Europe",
  "JM": "North America",
  "JO": "Asia",
  "JP": "Asia",
  "KE": "Africa",
  "KG": "Asia",
  "KH": "Asia",
  "KI": "Australia",
  "KM": "Africa",
  "KN": "North America",
  "KP": "Asia",
  "KR": "Asia",
  "KW": "Asia",
  "KY": "North America",
  "KZ": "Asia",
  "LA": "Asia",
  "LB": "Asia",
  "LC": "North America",
  "LI": "Europe",
  "LK": "Asia",
  "LR": "Africa",
  "LS": "Africa",
  "LT": "Europe",
  "LU": "Europe",
  "LV": "Europe",
  "LY": "Africa",
  "MA": "Africa",
  "MC": "Europe",
  "MD": "Europe",
  "ME": "Europe",
  "MG": "Africa",
  "MH": "Australia",
  "MK": "Europe",
  "ML": "Africa",
  "MM": "Asia",
  "MN": "Asia",
  "MO": "Asia",
  "MP": "Australia",
  "MQ": "North America",
  "MR": "Africa",
  "MS": "North America",
  "MT": "Europe",
  "MU": "Africa",
  "MV": "Asia",
  "MW": "Africa",
  "MX": "North America",
  "MY": "Asia",
  "MZ": "Africa",
  "NA": "Africa",
  "NC": "Australia",
  "NE": "Africa",
  "NF": "Australia",
  "NG": "Africa",
  "NI": "North America",
  "NL": "Europe",
  "NO": "Europe",
  "NP": "Asia",
  "NR": "Australia",
  "NU": "Australia",
  "NZ": "Australia",
  "OM": "Asia",
  "PA": "North America",
  "PE": "South America",
  "PF": "Australia",
  "PG": "Australia",
  "PH": "Asia",
  "PK": "Asia",
  "PL": "Europe",
  "PM": "North America",
  "PN": "Australia",
  "PR": "North America",
  "PS": "Asia",
  "PT": "Europe",
  "PW": "Australia",
  "PY": "South America",
  "QA": "Asia",
  "RE": "Africa",
  "RO": "Europe",
  "RS": "Europe",
  "RU": "Europe",
  "RW": "Africa",
  "SA": "Asia",
  "SB": "Australia",
  "SC": "Africa",
  "SD": "Africa",
  "SE": "Europe",
  "SG": "Asia",
  "SH": "Africa",
  "SI": "Europe",
  "SJ": "Europe",
  "SK": "Europe",
  "SL": "Africa",
  "SM": "Europe",
  "SN": "Africa",
  "SO": "Africa",
  "SR": "South America",
  "ST": "Africa",
  "SV": "North America",
  "SY": "Asia",
  "SZ": "Africa",
  "TC": "North America",
  "TD": "Africa",
  "TF": "Antarctica",
  "TG": "Africa",
  "TH": "Asia",
  "TJ": "Asia",
  "TK": "Australia",
  "TM": "Asia",
  "TN": "Africa",
  "TO": "Australia",
  "TR": "Asia",
  "TT": "North America",
  "TV": "Australia",
  "TW": "Asia",
  "TZ": "Africa",
  "UA": "Europe",
  "UG": "Africa",
  "US": "North America",
  "UY": "South America",
  "UZ": "Asia",
  "VC": "North America",
  "VE": "South America",
  "VG": "North America",
  "VI": "North America",
  "VN": "Asia",
  "VU": "Australia",
  "WF": "Australia",
  "WS": "Australia",
  "YE": "Asia",
  "YT": "Africa",
  "ZA": "Africa",
  "ZM": "Africa",
  "ZW": "Africa"
}

let locationCollection = [], mapDataCollection = [];

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

app.get("/getBubbleMapData", (req, res) => {
  fetchLocations(res);
});

function fetchLocations(res) {
  xmlRead.readXML(txtData, function(err, data) {
    const ast = XmlReader.parseSync(data.content);
    const locationCollectionObj = xmlQuery(ast).find('Location').children().ast;

    locationCollectionObj.forEach(loc => {
      locationCollection.push(loc.value);
    });

    fetchMapData(0, locationCollection.length, res);
  });
}

function fetchMapData(counter, len, res) {
  const geoRequest = geocoder.geocode({ 'address': locationCollection[counter] });
  
  setTimeout(() => {
    geoRequest.then(r => {
      const data = r[0];
      if(data) {
        mapDataCollection.push({
          lat: data.latitude,
          lng: data.longitude,
          continent: CONTINENTS[data.countryCode],
          n: 1
        });
      }

      if(counter + 2 < len) {
        fetchMapData(counter + 1, len)
      } else {
        const csv = new ObjectsToCsv(mapDataCollection);
        csv.toDisk('./views/map-data.csv');
        res.status(201).json({
          message: 'Data fetch success'
        })
      }
    }, error => {
      console.log(error);
    });
  }, 500);
}

app.listen(port, () =>
  console.log(`app listening at http://localhost:${port}`)
);
