/*
	Model.Fields - Field types for the $data in Models.
	requires: mvc/Model
	provides: Model.Fields
*/
Model.Fields = {
	
	Field: new Class({
		
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
		
		screen: function(value) {
			return value instanceof this.options.type ? value : new this.options.type(value);
		},
		
		validate: function(value) {
			
		},
		
		get: function(key) {
			return this.options[key];
		}
		
	}),
	
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
	
	ForeignKey: function(options) {
		return this.NumberField(options);
	}
	
};