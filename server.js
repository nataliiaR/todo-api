var express= require('express');
var app = express();
var PORT =process.env.PORT || 3000;
//todos collection of todo models
var todos=[{
	id:1,
	description: 'Make excercise',
	completed: false
}, {
	id: 2,
	description: 'Go to item',
	completed: false
},{
	id:3,
	description: 'Wash dishes',
	completed:true
}];

//Get request , root of our api

app.get ('/', function(req, res){
	res.send('Todo API root');

});

// Get /todos
app.get('/todos', function(req,res){
	//return the todos array converted in json, as we can pass a text only. 
	//todos is sent back to the caller
	res.json(todos);

});

//Get /todos/:id
app.get('/todos/:id', function(req,res){
	res.send('Asking for todo with id of ' + req.params.id);
});

app.listen(PORT, function(){
 	console.log('express listening on port');
 });