var ExpensesController = new Class({
	
	Extends: Controller,	
	
	listExpenses: function(expenses) {
		$(this).set('html', this.view('expenses/index', { expenses: expenses }));
	},
	
	events: {
		
		load: function() {
			Expense.findAll(this.listExpenses.bind(this));
		},
		
		'click:relay(.expense .delete)': function(e) {
			alert($(e.target).model());//.destroy().model().destroy();
		}
		
	}
	
});

Core.register_controller(ExpensesController);