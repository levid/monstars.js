var APIController = new Class({
	
	Extends: Controller,	
	
	list: function(tasks) {
		//$(this).set('html', this.view({ tasks: tasks }));
	},
	
	events: {
		
		load: function() {
			Klass.findAll(this.list.bind(this));
		},
		
		'click:relay(.klass > a)': function(e) {
			
		}
		
	}
	
});

Controller.register_controller(APIController);