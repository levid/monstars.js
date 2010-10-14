var TasksController = new Class({
	
	Extends: Controller,	
	
	list: function(tasks) {
		$(this).set('html', this.view({ tasks: tasks }));
	},
	
	events: {
		
		load: function() {
			Task.findAll(this.list.bind(this));
		},
		
		'click:relay(.task .delete)': function(e) {
			var taskEl = $(e.target).getParent('.task'),
				task = taskEl.get('model');
			
			task.destroy(function() {
				taskEl.destroy();
			});
		},
		
		'submit:relay(form)': function(e) {
			e.stop();
			var that = this,
				form = $(e.target),
				task = new Task(form.serialize());
			
			task.save(function(t) {
				form.reset();
				Task.findAll(that.list.bind(that));
			});
		}
		
	}
	
});

Controller.register_controller(TasksController);