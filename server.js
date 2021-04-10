const express = require('express')
const app = express();
var mysql = require('mysql')

var port = process.env.PORT || 8005;
var responseStr = "MySQL Data:";

app.engine('.html',require('ejs').renderFile)
app.set('views',__dirname + '/views');
app.set('view engine', 'html');
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(__dirname+'/public'));

app.get("/",function(req,res){
    var mysqlHost = process.env.MYSQL_HOST || 'localhost';
    var mysqlPort = process.env.MYSQL_PORT || '3306';
    var mysqlUser = process.env.MYSQL_USER || 'root';
    var mysqlPass = process.env.MYSQL_PASS || 'your new password';
    var mysqlDB = process.env.MYSQL_DB ;
    var connectionOptions = mysql.createConnection({
      host: mysqlHost,
      port: mysqlPort,
      user: mysqlUser,
      password: mysqlPass,
      database: mysqlDB
    });
    console.log('MySQL Connection config:');
    console.log(connectionOptions);

    var connection = mysql.createConnection(connectionOptions);
    connection.connect();

    res.render("index");
})

app.listen("8080",function(req,res){
    console.log("Listening on port 8080")
});


