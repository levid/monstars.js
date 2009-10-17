/*
	Model.Ajax - Ajax Model class for Web Server Storage
	Dependencies: mootools-core/Request.JSON
*/
Model.Ajax = new Class({
   
    Extends: Model,
    
    _urls: {},    
    
    save: function(callback) {
        this.data.id ?
            this._update() :
            this._insert();
        
        if ($type(callback) == 'function')
            callback(this);
        
        return this;
    },
    
    _update: function(callback) {
        var that = this;
        var request = new Request.JSON({
            url: "/controller/update",
            method: 'post',
            onSuccess: function(response) {
                callback(that)
            }
        }).send(Hash.toQueryString(this.data))
    }.protect(),
    
    _insert: function() {
        
    }.protect(),
    
    destroy: function(callback) {
        if($type(callback) == 'function')
            callback(this);
        return this;
    },
    
    $request: function() {
        
    }
    
});

Model.Ajax.get = function(type, options, callback) {
    options = options || { id: options };
    
};

Model.Ajax.find = function(type, conditions, options, callback) {
    var request = new Request.JSON();
};

Model.Ajax.findAll = function(type, callback) {
    return this.find(type, null, null, callback);
};
