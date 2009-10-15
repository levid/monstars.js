var Core = {
	
	version: '0.1',
	
	$controllers: [],
	
	register_controller: function(controller) {
		this.$controllers.push(controller);
	},
	
	retrieve_controllers: function() {
		return this.$controllers;
	}
	
};