/*
	Model.Ajax - Ajax Model class for Web Server Storage
	Dependencies: mootools-core/Request.JSON
*/
(function() {
Model.Ajax = new Class({
   
    Extends: Model,
    
    save: function(callback) {
        this.$data.id ?
            this._update(callback) :
            this._insert(callback);
        
        return this;
    },
    
    _update: function(callback) {
        var request = this.$request(this.url('update'), callback)
        return this;
    }.protect(),
    
    _insert: function(callback) {
        var that = this;
        var success = function(response) {
            Array.from(response).each(function(obj) {
                if(obj.fields) {
                    obj.fields.id = obj.fields.id || obj.pk || obj.id;
                    that.set(obj.fields)
                } else {
                    that.set(obj);
                }                
            });
        };
        var request = this.$request(this.url('insert'), callback, success)
        return this;
    }.protect(),
    
    destroy: function(callback) {
        var request = this.$request(this.url('delete'), callback)
        
        return this;
    },
    
    $request: function(url, callback, success) {
        var that = this;
        return request = new Request.JSON({
            url: url,
            method: 'post',
            onSuccess: function(response) {
                if(typeOf(success) == 'function')
                    success(response);
                if(typeOf(callback) == 'function')
                    callback(that);
            }
        }).send({ data: this.getWriteableData() });
    }.protect(),
    
    url: function(action) {
        if(this.useFixture) {
			return init.app_dir() + 'tests/fixtures/'+this.get_class()+'s.js';
		}
		var that = this;
		var STATIC = window[this.get_class()].$urls || {};
        var root = STATIC.root || '/';
        var controller_name = STATIC.controller_name || this.get_class().toLowerCase() + 's';
        var method = (STATIC[action] && STATIC[action].replace(/\{([^\}]+)\}/g, function(match, group1) { return that.get(group1); })) || action;
        var uri = root + controller_name + '/' + method;
        return uri;
    }.protect()
    
});

var _request = function(url, callback) {
	var that = this;
	if(this.prototype.useFixtures) {
		var uri = init.app_dir() + 'tests/fixtures/'+GetClass.get(this).toLowerCase()+'s.json';
	} else {
		var STATIC = window[GetClass.get(this)].$urls || {},
			root = STATIC.root || '/',
			controller_name = STATIC.controller_name || GetClass.get(this).toLowerCase() + 's',
			method = (STATIC['find'] && STATIC['find'].substitute(this.data)) || 'find',
			uri = root + controller_name + '/' + method;
	}
	var request = new Request.JSON({
		url: uri,
		method: 'get',
		onSuccess: function(response) {
			if(typeOf(callback) == 'function') {
				callback(response);
			}
		},
		onFailure: function(e) {
			console.error(e);
			callback([]);
		}
	});
};

Model.Ajax.get = function(type, options, callback) {
    options = options || { id: options };
    
};

Model.Ajax.find = function(conditions, options, callback) {
	var that = this;
	if(typeOf(options) == 'function') {
		callback = options;
		options = null;
	}
	if(this.prototype.useFixtures) {
		var uri = init.app_dir() + 'tests/fixtures/'+GetClass.get(this).toLowerCase()+'s.json';
	} else {
		var STATIC = window[GetClass.get(this)].$urls || {},
			root = STATIC.root || '/',
			controller_name = STATIC.controller_name || GetClass.get(this).toLowerCase() + 's',
			method = (STATIC['find'] && STATIC['find'].substitute(this.data)) || 'find',
			uri = root + controller_name + '/' + method;
	}
	var request = new Request.JSON({
		url: uri,
		method: 'get',
		onSuccess: function(response) {
			if(typeOf(callback) == 'function') {
				callback(that.wrap(response));
			}
		},
		onFailure: function(e) {
			console.error(e);
			callback([]);
		}
	}).send(conditions && Object.toQueryString(conditions));
};

Model.Ajax.findAll = function(callback) {
    return this.find(null, null, callback);
};

Request.implement('isSuccess', function() {
	return (this.status >= 200 && this.status < 300) || (this.status == 0 && this.xhr.responseText != '');
});

})();