const express = require('express')
const app = express();
var mysql = require('mysql')

var port = process.env.PORT || 8005;
var responseStr = "MySQL Data:";
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    multipleStatements: true // this allow you to run multiple queries at once.
  });

con.connect(function(err){
if (err) throw err;
console.log("Connected!");
con.query("CREATE DATABASE sociality", function (err, result) {
  if (err) throw err;
  console.log("Database created");
});
})

app.engine('.html',require('ejs').renderFile)
app.set('views',__dirname + '/views');
app.set('view engine', 'html');
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(__dirname+'/public'));

app.get("/",function(req,res){
    
    res.render("index");
})

app.listen("8080",function(req,res){
    console.log("Listening on port 5000")
});