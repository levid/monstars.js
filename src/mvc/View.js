/*
	View. - Representation of data from Models. Receives content at contruction
	or can be updated. Render will apply the content to the template. Template
	is supplied by the extending class.
	
	Dependencies: 
*/
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