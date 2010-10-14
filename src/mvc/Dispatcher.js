/*
    Dispatcher.js - Dispatches program.  Should run everything, setup database,
    models, views, and controllers, etc.
*/

var Dispatcher = new Class({
   
    Implements: [Events],
    
    initialize: function() {
        //setup DB
        if(window.Database) {
            this.setupDB();
        }
        
		this.create_controllers();
        this.loaded();
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
			}
        });
    }.protect(),
	
	create_controllers: function() {
		var controllers = Controller.retrieve_controllers();
		for(var c = 0; c < controllers.length; c++) {
			new controllers[c]();
		}
	}.protect(),
	
	loaded: function() {
		this.fireEvent('loaded');
	}.protect()
    
});

window.addEvent('domready',function() {
	new Dispatcher();
});