Model.Ajax = new Class({
   
    Extends: Model,
    
    _urls: {},    
    
    save: function(callback) {
        this.data.id ?
            this._update() :
            this._insert();
        
        if ($type(callback) == 'function')
            callback(this);
    },
    
    _update: function() {
        
    }.protect(),
    
    _insert: function() {
        
    }.protect(),
    
    destroy: function() {
        
    }
    
});

Model.Ajax.find = function() {
    
};

Model.Ajax.findAll = function() {
    
};
