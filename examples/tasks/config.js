init.core();
init.mvc( 'Store','Model.Browser');
init.app(function() {
	init.models('Task');
	init.controllers('Tasks');
	init.views(); //views can be added here if you them to load on startup
});