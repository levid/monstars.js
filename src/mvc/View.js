var View = new Class({
    
    Implements: Events,
	
	template: null,
    
    content: {},
    
    initialize: function(content) {
        this.content = content || {};
		this.bindEvents();
    },
    
    update: function(newData) {
    	this.content = newData.data || newData;
    },
	
	bindEvents: function() {
		for(var prop in this) {			
			if($type(this[prop]) == 'function' && prop.substring(0,2) == 'on') {
				this.addEvent(prop.substring(2).toLowerCase(), this[prop], true);
			}
		}
	}.protect(),
    
    render: function() {
		this.fireEvent('render');
    }
    
});