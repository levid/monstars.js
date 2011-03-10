/*
	View. - Representation of data from Models. Parses a template file, and renders.
*/	
var View = new Class({
    
    Implements: [Events],
	
	template: null,
	
	name: null,
	
	output: null,
    
    initialize: function(view) {
		this.template = View.$cache[view] || (View.$cache[view] = this.process(init.view(view)));
		this.name = view;
    },
	
	//if passed a function, we assume the function is a pre-compiled template.
	process: function(template) {
		return typeof template == 'function' ?
			template :
			new Function('obj',
				'var p=[],print=function(){p.push.apply(p,arguments);};' +
				'with(obj){p.push(\'' +
				template
					.replace(/[\r\t\n]/g, " ")
					.split("<%").join("\t")
					.replace(/((^|%>)[^\t]*)'/g, "$1\r")
					.replace(/\t=(.*?)%>/g, "',$1,'")
					.replace(/\t:(.*?)%>/g, "',new Element('div').set('text',$1).get('html'),'")
					.replace(/\t\?(.*?)%>/g, "',(typeof $1 != 'undefined')?$1:'','")
					.split("\t").join("');")
					.split("%>").join("p.push('")
					.split("\r").join("\\'")
				+ "');}return p.join('');");
	}.protect(),
    
    render: function(data) {
		this.output = data ? this.template(Object.merge({}, data, View.Helpers)) : this.template(View.Helpers);
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

//caches processed View Template functions, so we only regex and eval once.
View.$cache = {};

View.Helpers = {
	
	view: function(view_name, data) {
		return new View(view_name).render(data || this);
	}
	
};