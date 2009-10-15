var Controller = new Class({
    
    Implements: [Events, Options, GetClass],
	
	options: {
		element: null
	},
    
    initialize: function(options) {
        this.setOptions(options);
		var el = this.options.element || this._controller_prefix();
		this.element = $(el) || document.body;
    },
	
	_controller_prefix: function() {
		var className = this.get_class();
		return className.replace(/Controller/gi,'');
	}.protect()
    
});