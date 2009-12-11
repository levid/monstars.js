init.core();
init.mvc('Model.Ajax','Controller.Drag');
init.app(function() {
	init.models('Expense');
	init.controllers('Expenses');
	init.views('expenses/index'); //should be able to not have to do this. things in here will loaded at start
});