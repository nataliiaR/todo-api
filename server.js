var express= require('express');
var bodyParser=require('body-parser');
var _ = require('underscore');
var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

var todos= [];
var todoNextId=1;


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
	var todoId=parseInt(req.params.id,10);
	var matchedTodo= _.findWhere(todos,{id: todoId});
	// var matchedTodo;

	// todos.forEach(function(todo){
	// 	if (todoId === todo.id){
	// 		matchedTodo = todo;
	// 	}
	// });
	if (matchedTodo){
		res.json(matchedTodo);
	} else{
		res.status(404).send();
	}
});

//POST /todos request to take data from user and add new todo item
app.post('/todos', function(req, res){

	var body = _.pick(req.body, 'description','completed');

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length===0){
		return res.status(400).send();
	}

	body.description=body.description.trim();

	//add id field 
	body.id=todoNextId++;
	// push body into array
	todos.push(body);
	res.json(body);
});

//Delete /todos/:id

app.delete('/todos/:id', function(req,res){
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (!matchedTodo){
		res.status(404).send("error: no todo found with that id");
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}

});


//put /todos/:id 
app.put('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	
	var body = _.pick(req.body, 'description','completed');
	var validAttributes={};

	if (!matchedTodo){
		res.status(404).send("error: no todo found with that id");
	}

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed=body.completed;
	} else if(body.hasOwnProperty('completed')){
		return res.status(400).send();
	} 

	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length>0){
		validAttributes.description=body.description;
	} else if(body.hasOwnProperty('description')){
		return res.status(400).send();
	} 

	_.extend(matchedTodo, validAttributes);

	res.json(matchedTodo);
});

app.listen(PORT, function(){
 	console.log('express listening on port');
 });