/*
	View. - Representation of data from Models. Parses a template file, and renders.
*/
var View = new Class({
    
    Implements: [Events],
	
	template: null,
    
    content: {},
    
    initialize: function(view) {
        this.template = init.view(view);
    },
    
    render: function(data) {
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
		
		var html = data ? fn($merge(data, View.Helpers)) : '';
		this.fireEvent('render');
		return html;
    }
    
});

View.Helpers = {
	
	view: function(view_name, data) {
		return new View(view_name).render(data || this);
	}
	
};