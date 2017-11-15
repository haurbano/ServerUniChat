var express = require('express');
var router = express.Router();
var path    = require("path");

var redis = require('redis');
var redis_client = redis.createClient(6379,"localhost");

/* 
* GET home page. 
*/
router.get('/', function(req, res, next) {
  redis_client.keys('*',function(err, keys){
    if (err){
      res.render('index', { clients: [], err: true, msg: "Error cargando clientes" });
    }else{
      res.render('index', { clients: keys.sort(), err: false, msg: "Clietes cargados" });
    }
  });  
  
});

/*
* Remove Clients
*/
router.get('/remove_clients', function(req, res, next){
  redis_client.flushdb(function(err,resp){
    if(err){
      res.redirect('back')
    }else{
      res.redirect('back');
    } 
  });
});

/*
* Update clients 
*/
router.get('/update_clients', function(req, res, next){
  console.log("path: "+ path.join(__dirname+'/../views/partials/clients_table'));
  redis_client.keys('*',function(err, keys){
    if (err){
      console.log("Error update clients: "+err);
      res.render('partials/clients_table', { clients: [], err: true, msg: "Error al cargar clientes, recarge a pagina" });
    }else{
      res.render('partials/clients_table', { clients: keys.sort(), err: false, msg: "Clietes cargados" });
    }
  }); 
});

module.exports = router;
