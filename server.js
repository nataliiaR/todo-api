var express= require('express');
var app = express();
var PORT =process.env.PORT || 3000;

//Get request , root of our api

app.get ('/', function(req, res){
	res.send('Todo API root');

});
 app.listen(PORT, function(){
 	console.log('express listening on port');
 })