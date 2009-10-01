/*
    Dispatcher.js - Dispatches program.  Should run everything, setup database,
    models, views, and controllers, etc.
*/

var Dispatcher = new Class({
   
    Implements: [Events],
    
    initialize: function() {
        this.addEvent('loaded',function() {
            //create Controllers
            //TODO: search for all Controllers
            new TasksController();
            console.log('end dispathcer');
        });
        
        //setup DB
        if(window.Database) {
            this.setupDB();
        } else {
            this.fireEvent('loaded');
        }
        
 
        
    },
    
    setupDB: function() {
        var db = Database.get(),
            that = this;
        db.addEvents({
            'error': function(e){
                var msg = e.error.details || 'DB is bwoken';
                throw new Error(msg);
            },
			'connect':function(e) {
				//TODO: find all Models and build tables for them
				db.query('CREATE TABLE IF NOT EXISTS tasks (id integer primary key autoincrement, text varchar(256))').addEvent('result',function() {
                    that.fireEvent('loaded');
                });
               
			}
        });
    }
    
});

window.addEvent('domready',function() {
    new Dispatcher();
});