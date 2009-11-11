/*
	View. - Representation of data from Models. Receives content at contruction
	or can be updated. Render will apply the content to the template. Template
	is supplied by the extending class.
	
	Dependencies: core/GetClass.js
*/
var View = new Class({
    
    Implements: [Events, GetClass],
	
	template: null,
    
    content: {},
    
    initialize: function(content) {
        this.update(content);
    },
    
    update: function(newData) {
    	newData instanceof Model ?
			this.model(newData) :
			this.content = newData;
    },
    
    render: function() {
		this.fireEvent('render');
    },
	
	model: function(model) {
		if(model) {
			this.$model = model;
			this.content = model.data;
			return this;
		} else {
			return this.$model;
		}
	}
    
});