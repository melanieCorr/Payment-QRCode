var express = require('express');
var app = express();
var bodyParser = require('body-parser');


/**
  * @method mongoose : initialization of the connection
  * @method schemaUser schemaArticle : schema creation containing several keys with typing
  * @method modelUser modelArticle : creation of new collection thanks to schema
**/

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bdd',  { useNewUrlParser: true },function(err){
  if(err){
    throw err;
  }
});

var schemaUser = new mongoose.Schema({
  pseudo : { type : String, match: /^[a-zA-Z0-9-_]+$/ }, 
  firstName : { type : String },
  lastName : { type : String },
  email : { type : String, match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/}, 
  password : { type : String, match: /^[a-zA-Z0-9-_]+$/ }
}, { versionKey: false });

var modelUser = mongoose.model('user', schemaUser);
var user = new modelUser();


var schemaArticle = new mongoose.Schema({
  article : { type : String, match: /^[a-zA-Z0-9-_]+$/}, 
  price : { type : String, match: /^[a-zA-Z0-9-_]+$/},
  idSeller : { type : mongoose.Schema.Types.ObjectId}
}, { versionkey: false });

var modelArticle = mongoose.model('product', schemaArticle);
var article = new modelArticle();



/**
  * @method get: executes the function passed at its second parameter
  * @method post: executes the function passed at its second parameter
**/

app.use(express.static(__dirname + '/controler'));
app.set('view engine', 'ejs');  


var urlencodedParser = bodyParser.urlencoded({ extended: false }) 


app.get('/',function(req,res){  
  res.sendFile(__dirname +'/views/index.html');
});

var sellerID;

app.post('/submit', urlencodedParser, function(req, res) {  
   response = {
      pseudo:req.body.uname,
      passw:req.body.passw,
   }

   modelUser.findOne({'pseudo' : response.pseudo}, function(error, userLog){
    if(error) throw error;

    if(userLog == null){
     console.log(response.pseudo + " n'a pas été trouvé.");
     res.redirect('/');
    }

    else {
      console.log(userLog);
      console.log(userLog.pseudo + " a bien été trouvé.");

      if(userLog.password != response.passw) res.redirect('/');

      else { 
        sellerID = userLog._id;
        res.render('SellOrBuy', {data: response}); 
        console.log("Le mdp de l'utilisateur est : " + userLog.password);
      }
    }

   });
})


app.get('/recapTransaction/:id', urlencodedParser, function(req,res){
  
  var articleID = req.params.id;
  console.log("ID = " + articleID);

  modelArticle.findOne({'_id' : articleID}, function(error, prod){
    if(error) throw error;

    else {
      console.log(prod);
      modelUser.findOne({'_id' : prod.idSeller}, function(error, userFound){
          if(error) throw error;

          if(userFound == null){
            console.log("Cet id n'existe pas");
          }

          else {
            response = {
              article: prod.article,
              price:prod.price,
              firstName:userFound.firstName,
              lastName:userFound.lastName
            }

            res.render('recapTransaction', {data: response});
          }
      });
    }
  });
}); 


app.post('/', urlencodedParser, function(req, res) {  

  modelUser.findOne({'pseudo' : req.body.uname}, function(error, userFound){
    if(error) throw error;

    if(userFound == null){
      user.pseudo = req.body.uname;
      user.firstName = req.body.fname;
      user.lastName = req.body.lname;
      user.email = req.body.email;
      user.password = req.body.passw;
      user.save();
      res.sendFile(__dirname +'/views/index.html');
    }

    else {
      console.log("Ce pseudo existe déjà.");
      res.redirect('/userData');
    }
  });
})


app.get('/Sell',function(req,res){  
  res.sendFile(__dirname +'/views/Sell.html');
});

app.get('/Buy', function(req, res){
  res.sendFile(__dirname + '/views/Buy.html');
});



app.post('/QrCode', urlencodedParser, function(req,res){
  article.article = req.body.article;
  article.price = req.body.price;
  article.idSeller = sellerID;
  article.save();
  res.render('QrCode', {dataID: article._id});
});


app.get('/userData', urlencodedParser, function(req,res){
  res.sendFile(__dirname +'/views/userData.html');
});


/**
  * @method listen: Creates a server that listens on port 8081
**/

var server = app.listen(8081, function () {
    var host = "127.0.0.1";
    var port = server.address().port;
    console.log("Application disponible depuis l'adresse : http://%s:%s", host, port);
});