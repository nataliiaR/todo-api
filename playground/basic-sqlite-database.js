var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect':'sqlite',
	'storage':__dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	description:{
		type:Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	completed:{
		type:Sequelize.BOOLEAN,
		allowNull:false
	}
});

sequelize.sync({force:true}).then(function (){
	console.log('Everything is sync');
	Todo.create({
		description:'Walking my dog',
		completed: false
	}).then(function(todo){
		console.log('Finished!');
		console.log(todo)
	});
});