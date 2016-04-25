var express= require('express');
var bodyParser=require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require ('bcrypt');
var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

var todos= [];
var todoNextId=1;


//Get request , root of our api

app.get ('/', function(req, res){
	res.send('Todo API root');

});

// Get /todos?completed=true&q=work
app.get('/todos', function(req,res){
	//return the todos array converted in json, as we can pass a text only. 
	//todos is sent back to the caller

	var query=req.query;
	var where = {};
	//	var queryParams=req.query;
	// var filterTodos= todos;

	// if (queryParams.hasOwnProperty('completed') && queryParams.completed==='true'){
	// 	filterTodos=_.where(filterTodos,{completed:true});
	// } else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
	// 	filterTodos = _.where(filterTodos, {completed:false});
	// }

	// if(queryParams.hasOwnProperty('q') && queryParams.q.length>0){
	// 	filterTodos = _.filter(filterTodos, function(todo){
	// 		return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase())>-1;
	// 	});
	// }

	// res.json(filterTodos);

	//----convert previous API calls to sequelize calls
	if (query.hasOwnProperty('completed') && query.completed==='true'){
		where.completed = true;
	} else if(query.hasOwnProperty('completed') && query.completed==='false'){
		where.completed = false;
	}
	if (query.hasOwnProperty('q') && query.q.length>0){
		where.description = {
			$like: '%' +query.q+ '%'
		};
	} 

	db.todo.findAll({where : where}).then(function(todos){
		res.json(todos);
	}, function(e){
		res.status(500).send();

	});
});

//Get /todos/:id
app.get('/todos/:id', function(req,res){
	var todoId=parseInt(req.params.id,10);
	// var matchedTodo= _.findWhere(todos,{id: todoId});
	// // var matchedTodo;

	// // todos.forEach(function(todo){
	// // 	if (todoId === todo.id){
	// // 		matchedTodo = todo;
	// // 	}
	// // });
	// if (matchedTodo){
	// 	res.json(matchedTodo);
	// } else{
	// 	res.status(404).send();
	// }


	// -----revrite in sequelize
	db.todo.findById(todoId).then(function(todo){
		if(!!todo){
			res.json(todo.toJSON());
		} else{
			res.status(404).send();
		}
	}, function(e){
		res.status(500).send();
	});


});

//POST /todos request to take data from user and add new todo item
app.post('/todos', function(req, res){

	var body = _.pick(req.body, 'description','completed');

	// if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length===0){
	// 	return res.status(400).send();
	// }

	// body.description=body.description.trim();

	// //add id field 
	// body.id=todoNextId++;
	// // push body into array
	// todos.push(body);
	// res.json(body);


	//-----call create on db.todo
	db.todo.create(body).then(function(todo){
		res.json(todo.toJSON());
	},function(e){
		res.status(400).json(e);
	});
});

//Delete /todos/:id

app.delete('/todos/:id', function(req,res){
	var todoId = parseInt(req.params.id, 10);
	// var matchedTodo = _.findWhere(todos, {id: todoId});

	// if (!matchedTodo){
	// 	res.status(404).send("error: no todo found with that id");
	// } else {
	// 	todos = _.without(todos, matchedTodo);
	// 	res.json(matchedTodo);
	// }
	db.todo.destroy({
		where:  {
			id: todoId
		}
	}).then(function(rowsDeleted){
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: 'No todo with id'
			});
		} else {
			res.status(204).send();
		}

	}, function(){
		res.status(500).send();
	});

});


//put /todos/:id 
app.put('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id, 10);
	// var matchedTodo = _.findWhere(todos, {id: todoId});
	
	var body = _.pick(req.body, 'description','completed');
	//var validAttributes={};
	var attributes = {};

	// if (!matchedTodo){
	// 	res.status(404).send("error: no todo found with that id");
	// }

	// if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
	// 	validAttributes.completed=body.completed;
	// } else if(body.hasOwnProperty('completed')){
	// 	return res.status(400).send();
	// } 

	// if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length>0){
	// 	validAttributes.description=body.description;
	// } else if(body.hasOwnProperty('description')){
	// 	return res.status(400).send();
	// } 

	// 	_.extend(matchedTodo, validAttributes);

	// res.json(matchedTodo);

	//------- revrite using sequelize model todo.js
	 if(body.hasOwnProperty('completed')){
	 	attributes.completed=body.completed;
	 } 

	 if(body.hasOwnProperty('description')){
	 	attributes.description=body.description;
	 }
	 //-------------

	 db.todo.findById(todoId).then(function(todo){
	 	if (todo){
	 		return todo.update(attributes);
	 	} else{
	 		res.status(404).send();
	 	}
	 }, function(){
	 	res.send(500).send();
	 }).then( function(todo){
	 	res.json(todo.toJSON());

	 }, function(e){
	 		res.status(400).json(e);

	 });

});


//--------for USER databases

app.post('/users', function(req, res){

	var body = _.pick(req.body, 'email','password');

	db.user.create(body).then(function(todo){
		res.json(todo.toPublicJSON());
	},function(e){
		res.status(400).json(e);
	});
});

// -------


// Post /users/login

app.post('/users/login', function(req, res){

	var body = _.pick(req.body, 'email','password');
	// login our new class method in user model
	db.user.login(body).then(function(user){
		res.json(user.toPublicJSON());
	}, function(e){
		res.status(401).send();
	});
});



//-----

db.sequelize.sync().then(function(){
	app.listen(PORT, function(){
 	console.log('express listening on port');
 });
});
