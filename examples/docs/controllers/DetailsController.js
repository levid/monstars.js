var DetailsController = new Class({
	
	Extends: Controller,
	
	index: function() {
		$(this).set('html', this.view());
	},
	
	list: function(tasks) {
		//$(this).set('html', this.view({ tasks: tasks }));
	},
	
	events: {
		
		load: function() {
			this.index();
		}
		
	}
	
});

Controller.register_controller(DetailsController);