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
                that.set(obj);
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
    var STATIC = window[GetClass.get(this)].$urls || {};
        var root = STATIC.root || '/';
        var controller_name = STATIC.controller_name || GetClass.get(this).toLowerCase() + 's';
        var method = (STATIC['find'] && STATIC['find'].substitute(this.data)) || 'find';
        var uri = root + controller_name + '/' + method;
    
    
    var request = new Request.JSON({
        url: uri,
        method: 'get',
        onSuccess: function(response) {
            if($type(callback) == 'function')
                callback(that)
        }
    }).send(Hash.toQueryString(conditions));
    console.log(request);
};

Model.Ajax.findAll = function(callback) {
    return this.find(null, null, callback);
};
