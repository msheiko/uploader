const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const fs = require('fs');

const app = express();
const port = 3000;

app.set("view engine", "hbs");
let students = [];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname + "/target"));
  },
  filename: function (req, file, cb) {
    cb(null, req.body.name + "-" + Date.now() + ".zip");
  },
});

const upload = multer({ storage }).single("task");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.render("index.hbs", {students});
});



app.post("/upload", (req, res) => {
    upload(req, res, function (err) {
        if (err) {
          console.error(err)
          return res.status(400).send(err);
        }
    
        console.log(req.file, req.body);
        return res.render("result.hbs");
      })

});

app.listen(port, () => {
    let rawdata = fs.readFileSync('users.json');
    students = JSON.parse(rawdata);
    console.log(`Loaded: ${students.length}`)
    console.log(`Example app listening on port ${port}`);
});
