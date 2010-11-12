init.core();
init.mvc( 'Store','Model.Browser');
init.app(function() {
	init.models('Task');
	init.controllers('Tasks');
	init.views('tasks/list'); //views can be added here if you want them to load on startup
});