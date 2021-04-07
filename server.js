const express = require('express')
const app = express();

app.engine('.html',require('ejs').renderFile)
app.set('views',__dirname + '/views');
app.set('view engine', 'html');
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(__dirname+'/public'));

app.get("/",function(req,res){
    res.render("index");
})

app.listen("5000",function(req,res){
    console.log("Listening on port 5000")
});