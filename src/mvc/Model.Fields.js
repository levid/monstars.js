/*
	Model.Fields - Field types for the $data in Models.
	requires: mvc/Model
	provides: Model.Fields
*/
(function() {

var Field = new Class({
		
	Implements: [GetClass, Options],
	
	$class: 'Model.Fields.Field',
	
	options: {
		type: String,
		'default': null,
		read: true,
		write: true
	},
	
	initialize: function(type, options) {
		options = options || {};
		options.type = type || options.type;
		this.setOptions(options);
	},
	
	set: function(value) {
		return value && (value instanceof this.options.type ? value : new this.options.type(value));
	},
	
	validate: function(value) {
		
	},
	
	get: function(value) {
		return value && value.valueOf();
	}
	
});

var bigDateFormat = /(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?)?/
var DateField = new Class({
	
	Extends: Field,
	
	set: function(value) {
		var match;
		if(typeOf(value) == 'string' && (match = value.match(bigDateFormat))) {
			value = new Date(match[1], parseInt(match[2], 10) - 1, parseInt(match[3], 10), parseInt(match[4] || 0, 10), parseInt(match[5] || 0, 10), parseInt(match[6] || 0, 10));
		}
		return this.parent(value);
	},
	
	get: function(value) {
		return value;
	}
	
})

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
		return new DateField(Date, options);
	},
	
	_ForeignKey: new Class({
		
		Extends: Field,
		
		$class: 'Model.Fields.ForeignKey',
		
		set: function(value) {
			return typeOf(value) == 'object' ? this.options.type.wrap(value)[0] : value;
		},
		
		get: function(id) {
			var klass = this.options.type;
			if(klass.$cache && klass.$cache[id]) {
				return klass.$cache[id];
			} else {
				return klass.wrap({ id: id })[0];
			}
		}
		
	}),
	
	ForeignKey: function(type, options) {
		if(!options && type.type) {
			options = type;
			type = options.type;
		}
		return new this._ForeignKey(type, options);
	},
	
	_ManyToManyField: new Class({
		
		Extends: Field,
		
		set: function(value) {
			var klass = this.options.type;
			if(typeOf(klass) == 'string') {
				klass = window[klass];
			}
			var arr = [];
			Array.from(value).each(function(item) {
				if(typeOf(item) == 'object') {
					arr.push(klass.wrap(item)[0].get('id'));
					; //ensures it gets added to the cache
					
				} else {
					arr.push(item);
				}
			});
			return arr;
		},
		
		get: function(array) {
			var klass = this.options.type;
			if(typeOf(klass) == 'string') {
				klass = window[klass];
			}
			var arr = [];
			Array.from(array).each(function(id) {
				if(klass.$cache && klass.$cache[id]) {
					arr.push(klass.$cache[id]);
				} else {
					arr.push(klass.wrap({ id: id })[0]);
				}
			});
			
			return arr;
		}
		
	}),
	
	ManyToManyField: function(type, options) {
		if(!options && type.type) {
			options = type;
			type = options.type;
		}
		
		return new this._ManyToManyField(type, options);
	}
	
};

})();
