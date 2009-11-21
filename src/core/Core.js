var Core = {
	
	$version: '0.1',
	
	$controllers: [],
	
	register_controller: function(controller) {
		if(this.$controllers.indexOf(controller) == -1)
			this.$controllers.push(controller);
	},
	
	retrieve_controllers: function() {
		return this.$controllers;
	},
	
	reset_controllers: function() {
		this.$controllers = [];
	}
	
};