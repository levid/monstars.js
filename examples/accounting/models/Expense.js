var Expense = new Class({
	
	Extends: Model.Ajax,
	
	fields: {
		id: Model.Fields.AutoField(),
		title: Model.Fields.TextField(),
		description: Model.Fields.TextField(),
		price: Model.Fields.NumberField()
	},
	
	useFixtures: true
	
});

//todo - Make this use fixtures.
/*Expense.findAll = function(callback) {
    console.log('hijacked Expense.findAll');
	var list = [];
	list[0] = new Expense({id:1, title: 'Pancakes', description: 'Kevin eats lots of pancakes.', price: 500 });
	list[1] = new Expense({id:2, title: 'Beer', price: 24.99 });
	
	if($type(callback) == 'function') {
		callback(list);
	}
};*/
