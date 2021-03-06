/*
	Model.SQL - SQL Model class for Adobe AIR, with Database functions
	Dependencies: mootools-fire/Database.js, monstar/GetClass.js
*/
Model.SQL = new Class({
   
    Extends: Model,
	
	$class: 'Model.SQL',
    
    initialize: function(data) {
        this.parent(data);
    },
    
    save: function(callback) {
        var db = Database.get();
		var that = this,
            data = Object.clone(this.data);
		if(this.data.id) {
            var q = db.INSERT(this.tableize(),data);
        } else {
            delete data.id;
            var q = db.UPDATE(this.tableize(),{id: this.data.id}, data);
        }
		q.addEvents({
			'error':function(e) {
				var msg = e.error.details || 'DB is bwoken'
                throw {message: msg};
			},
			'result':function(result) {
				that.data.id = result.lastInsertRowID;		//set this.data.id = new row ID
                if(callback) callback(that);
			}
		});
        return this;
    },
    
    destroy: function() {
        var db = Database.get();
		var q = db.DELETE(this.tableize(),{id: this.get(id)});
        q.addEvents({
			'error':function(e) {
				var msg = e.error.details || 'DB is bwoken'
                throw msg;
			},
			'result':function(result) {
				delete that.data.id;
			}
		});
        return this;
    },
    
    tableize: function() {
        return this.get_class().toLowerCase() + 's';
    }
    
});
//TODO: consider how new models are supposed to integrate find
Model.SQL.find = function(condition, options, callback) {
    var db = Database.get();
	var table = GetClass.get(this).toLowerCase() + 's';
	condition = condition || 1;
	var q = db.SELECT(table, condition, options);
    console.log(q);
	var models = [];
	q.addEvents({
		'error':function(e) {
			throw 'Failed select on ' + table; 
		},
		'result':function(result) {			
			
			models = this.wrap(result.data);
			if(callback) callback(models);
		}
	});
	return this;
};

Model.SQL.findAll = function(type, callback) {
    return this.find(type, null, null, callback);
};