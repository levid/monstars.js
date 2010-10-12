(function() {

var _instances = {};

this.Controller = new Class({
    
    Implements: [Events, GetClass],
	
	element: null,
    
    initialize: function() {
		var instance = _instances[this._controller_prefix()]
		if(instance) {
			return instance;
		}
		var el = this.element || this._controller_prefix();
		if(el == 'Document') el = document.body;
		this.element = $(el) || new Element('div', { id: el}).inject(document.body); // or throw Error?
		this.bindEvents();
		this.element.store('$mvc:controller', this);
		return _instances[this._controller_prefix()] = this;
    },
	
	bindEvents: function() {
		var events = this.events;
		for(var prop in events) {			
			var ev = prop.replace(/^on/,'');
			if(prop != 'load' && typeOf(events[prop]) == 'function') {
				this.element.addEvent(ev, events[prop].bind(this), true);
			} else if (prop == 'load') {
				window.addEvent('domready', events[prop].bind(this));
			}
		}
	}.protect(),
	
	_controller_prefix: function() {
		return this.get_class().replace(/Controller/gi,'');
	}.protect(),
	
	view: function(view_name, data) {
		try {
			if(!data && typeOf(view_name) != 'string') {
				data = view_name;
				view_name = null;
			}
			view_name = view_name || this._controller_prefix().toLowerCase() + '/' + arguments.callee.caller.caller.caller.$name;
		} catch(e) {
			throw new Error('View name was not specified, and could not determine from controller action.');
		}
		
		return View.Helpers.view(view_name, data || this);
	}.protect(),
	
	toElement: function() {
		return this.element;
	}
    
});

Controller.getInstance = function() {
	return new this();
};

Element.Properties.controller = {
	
	get: function() {
		return this.retrieve('$mvc:controller');
	}
	
}

})();