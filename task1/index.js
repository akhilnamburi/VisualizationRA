var express = require("express");
var app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/views"));

var fs = require("fs");
const path = require("path");

var folder = path.join(__dirname, "text/");

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

app.get("/", async (req, res) => {
  res.render("index", { files: data });
});

app.get("/readFile/:name", (req, res) => {
  res.send(data[req.params.name]);
});

app.listen(port, () =>
  console.log(`app listening at http://localhost:${port}`)
);
