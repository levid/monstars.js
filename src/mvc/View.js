var View = new Class({
    
    Implements: Events,
	
	template: null,
    
    content: {},
    
    initialize: function(content) {
        this.content = content instanceof Model ? content.data : content || {};
    },
    
    update: function(newData) {
    	this.content = newData.data || newData;
    },
    
    render: function() {
		this.fireEvent('render');
    }
    
});