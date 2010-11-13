init.core();
init.mvc('Model.Ajax');
init.app(function() {
	init.models();
	init.controllers();
	init.views(); //views can be added here if you want them to load on startup
});