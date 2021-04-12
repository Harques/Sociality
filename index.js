const express = require('express');
const mysql = require('mysql2');
const rp = require('request-promise');
const cheerio = require('cheerio');

const mysqlConfig = {
  host: "mysql_server",
  user: "user",
  password: "pass",
  database: "sociality_db"
}

let con = null

const app = express()
app.engine('.html',require('ejs').renderFile)
app.set('views',__dirname + '/views');
app.set('view engine', 'html');
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(__dirname+'/public'));

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  con = mysql.createConnection(mysqlConfig);
  con.connect(function(err) {
    if (err) res.send(err);
    else{
      const sql = `
      CREATE TABLE IF NOT EXISTS PRODUCTS (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(300) NOT NULL,
        image VARCHAR(1000) NOT NULL,
        price FLOAT NOT NULL
      )  ENGINE=INNODB;
    `;
    con.query(sql, function (err, result) {
      if (err)  res.send(err);
      else res.render('index');
    });  
    }
  });
})

app.post('/insert', function (req, res) {
  con.connect(function(err) {
    if (err) throw err;
    const options = {
      url: req.body.productLink,
      transform: function(body){
        return cheerio.load(body);
      }
      }
    rp(options).then(function($){
      var title = $('h1').html().trim();
      var price = $('p.wt-text-title-03.wt-mr-xs-2').text().trim();
      price = price.substring(1);
      if (price.charAt(price.length-1) == '+')
        price = price.substring(0,price.length-1); 
      var imgLink = $('img[data-index="0"]').attr('src');
      const sql = `INSERT INTO PRODUCTS (name, image, price) VALUES ("${title}","${imgLink}",${price})`
      con.query(sql, function (err, result) {
        res.send.bind(res);
        if (err) throw err;
        res.send(`${title} is inserted into the table.`)
      });
    })
    })
})
app.get('/table',function(req,res){
  res.render('table')
});
app.get('/product',function(req,res){
  res.render('product')
})
app.post('/fetch', function (req, res) {
  con.connect(function(err) {
    if (err) throw err;
    const sql = `SELECT * FROM PRODUCTS`
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
})

app.post('/query',function(req,res){
  con.connect(function(err) {
    if (err) throw err;
    var sql = `SELECT * FROM PRODUCTS WHERE id =` + req.body.productID;
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
})
app.listen("3000",function(req,res){
  console.log("Listening on port 3000")
});

