/*
	Model.Ajax - Ajax Model class for Web Server Storage
	Dependencies: mootools-core/Request.JSON
*/
Model.Ajax = new Class({
   
    Extends: Model,
    
    save: function(callback) {
        this.data.id ?
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
            $splat(response).each(function(obj) {
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
                if($type(success) == 'function')
                    success(response);
                if($type(callback) == 'function')
                    callback(that);
            }
        }).send(Hash.toQueryString(this.data));
    }.protect(),
    
    url: function(action) {
        if(this.useFixture) {
			return init.app_dir() + 'tests/fixtures/'+this.get_class()+'s.js';
		}
		var STATIC = window[this.get_class()].$urls || {};
        var root = STATIC.root || '/';
        var controller_name = STATIC.controller_name || this.get_class().toLowerCase() + 's';
        var method = (STATIC[action] && STATIC[action].substitute(this.data)) || action;
        var uri = root + controller_name + '/' + method;
        return uri;
    }.protect()
    
});

Model.Ajax.get = function(type, options, callback) {
    options = options || { id: options };
    
};

Model.Ajax.find = function(conditions, options, callback) {
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
			if($type(callback) == 'function') {
				var models = [];
				$splat(response).each(function(m) {
					models.push(new that(m));
				});
				callback(models);
			}
		},
		onFailure: function(e) {
			console.error(e);
			//throw e;
		}
	}).send(conditions && Hash.toQueryString(conditions));
};

Model.Ajax.findAll = function(callback) {
    return this.find(null, null, callback);
};

Request.implement('isSuccess', function() {
	return (this.status >= 200 && this.status < 300) || (this.status == 0 && this.xhr.responseText != '');
});
