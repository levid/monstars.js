/*
	View. - Representation of data from Models. Parses a template file, and renders.
*/
var View = new Class({
    
    Implements: [Events],
	
	template: null,
	
	output: null,
    
    initialize: function(view) {
        this.template = init.view(view);
    },
    
    render: function(data) {
		//TODO - cache this Function
		//currently its being re-constructed every View call. wasteful.
		var str = this.template;
		var fn = new Function('obj',
			'var p=[],print=function(){p.push.apply(p,arguments);};' +
			'with(obj){p.push(\'' +
			str
				.replace(/[\r\t\n]/g, " ")
				.split("<%").join("\t")
				.replace(/((^|%>)[^\t]*)'/g, "$1\r")
				.replace(/\t=(.*?)%>/g, "',$1,'")
				.split("\t").join("');")
				.split("%>").join("p.push('")
				.split("\r").join("\\'")
			+ "');}return p.join('');");
		
		this.output = data ? fn($merge(data, View.Helpers)) : '';
		this.fireEvent('render');
		return this;
    },
	
	toString: function() {
		return this.output;
	},
	
	toElement: function() {
		return new Element('div', { html: this.output }).getFirst();
	}
    
});

View.Helpers = {
	
	view: function(view_name, data) {
		return new View(view_name).render(data || this);
	}
	
};