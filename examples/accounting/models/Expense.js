var Expense = new Class({
	
	Extends: Model.Ajax,
	
	data: {
		id: null,
		title: null,
		description: null,
		price: null
	}
	
});

Expense.$urls = {
	'controller_name':'expenses',
	'update': 'save',
	'insert': 'new',
	'find': 'all',
	'delete': 'kill'
};

//TODO: find way to automagically do this?
Expense.get = Model.Ajax.get;
Expense.find = Model.Ajax.find;


Expense.findAll = function(callback) {
    console.log('hijacked Expense.findAll');
	var list = [];
	list[0] = new Expense({id:1, title: 'Pancakes', description: 'Kevin eats lots of pancakes.', price: 500 });
	list[1] = new Expense({id:2, title: 'Beer', price: 24.99 });
	
	if($type(callback) == 'function') {
		callback(list);
	}
};
//Expense.findAll = Model.Ajax.findAll;