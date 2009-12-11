var ExpensesController = new Class({
	
	Extends: Controller,	
	
	listExpenses: function(expenses) {
		$(this).set('html', this.view('expenses/index', { expenses: expenses }));
	},
	
	events: {
		
		load: function() {
			Expense.findAll(this.listExpenses.bind(this));
		}
		
	}
	
});

Core.register_controller(ExpensesController);