/*
	Model. - Model, and Model.Fields
	Dependencies: monstar/GetClass.js
*/
var Model = new Class({
    
    Implements: [GetClass],
    
    $data: {}, //private object to hold data
	
	fields: {}, //declares the types and other options of what can be in $data
    
    initialize: function(data) {
        this.set(data);        
    },

    set: function(prop, value) {
		if ($type(prop) == 'object'){
			for (var p in prop) this.set(p, prop[p]);
			return this;
		}
		if(this.fields[prop]) {
			this.$data[prop] = this.fields[prop].set($unlink(value));
		}
		return this;
	},
    
    get: function(prop) {
    	return this.fields[prop] && this.fields[prop].get(this.$data[prop])
    },
	
	identity: function() {
		return this.get_class().replace(/\./g, '_') + '_' + this.get('id');
	},
    
    save: function() {
        throw { message: this.get_class() + ' has not implemented save'};
    },
    
    destroy: function() {
        throw { message: this.get_class() + ' has not implemented destroy'};
    }
    
});

Model.wrap = function(models) {
	var instances = [],
		that = this;
	var cache = this.$cache || (this.$cache = {});
	
	$splat(models).each(function(m) {
		var inst = new that(m.$data || m);
		that.$cache[inst.get('id')] = inst;
		instances.push(inst);
	});
	return instances;
}

Model.get = function() {
	throw { message: GetClass.get(this) + ' has not implemented get'};
}

Model.find = function() {
    throw { message: GetClass.get(this) + ' has not implemented find'};
};

Model.findAll = function() {
    throw { message: GetClass.get(this) + ' has not implemented findAll'};
};

Element.Properties.model = {
	'get': function() {
		var places_to_check = '',
			id = this.get('id');
		if(id) {
			places_to_check += id + ' ';
		}
		places_to_check += this.className;
		
		var reg = RegExp('([a-zA-Z_]+?)_([^\\s]+)', 'g'),
			match;
			
		while(match = reg.exec(places_to_check)) {
			var klass = window[match[1].replace('_', '.')];
			if(klass) {
				return klass.$cache && klass.$cache[match[2]];
			}
		}
		return null;
	}
};