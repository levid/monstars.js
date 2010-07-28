/*
	Model.Fields - Field types for the $data in Models.
	requires: mvc/Model
	provides: Model.Fields
*/
(function() {

var Field = new Class({
		
	Implements: Options,
	
	options: {
		type: String,
		'default': null
	},
	
	initialize: function(type, options) {
		options = options || {};
		options.type = type || options.type;
		this.setOptions(options);
	},
	
	set: function(value) {
		return value instanceof this.options.type ? value : new this.options.type(value);
	},
	
	validate: function(value) {
		
	},
	
	get: function(value) {
		return value;
	}
	
});

Model.Fields = {
	
	Field: Field,
	
	TextField: function(options) {
		return new this.Field(String, options);
	},
	
	NumberField: function(options) {
		return new this.Field(Number, options);
	},
	
	AutoField: function(options) {
		return this.NumberField(options);
	},
	
	BooleanField: function(options) {
		return new this.Field(Boolean, options);
	},
	
	DateField: function(options) {
		return new this.Field(Date, options);
	},
	
	_ForeignKey: new Class({
		
		Extends: Field,
		
		set: function(value) {
			return $type(value) == 'object' ? value.id : value;
		},
		
		get: function(id) {
			var klass = this.options.type;
			if(klass.$cache && klass.$cache[id]) {
				return klass.$cache[id];
			} else {
				return new klass({ id: id });
			}
		}
		
	}),
	
	ForeignKey: function(options) {
		return new this._ForeignKey(options);
	}
	
};

})();
