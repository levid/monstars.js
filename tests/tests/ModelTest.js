var ModelTest = new TestCase({
	'initialize': function() {
		var m = new TestModel({id: 44123, title:'Init Test', fake: "Won't Exist"});
		
		this.assertTrue(m instanceof Model);
		this.assertEqual(m.get('id'), 44123);
		this.assertEqual(m.get('title'), 'Init Test');
		this.assertFalse(m.get('fake'));
	},
	'set and get': function() {
		var m = new TestModel();
		this.assertFalse(m.get('title'), 'no values at construction should mean no values set');
		
		m.set('title', 'TestTitle');
		this.assertEqual(m.get('title'), 'TestTitle', 'can use set(key, value)');
		
		m.set({title: 'DifferentTitle'});
		this.assertEqual(m.get('title'), 'DifferentTitle','can use set with object of key/value pairs');
	},
	'Model.Fields': function() {
		var FieldModel = new Class({
			Extends: Model,
			fields: {
				id: Model.Fields.AutoField(),
				title: Model.Fields.TextField()
			}
		});
		//maybe this should be its own TestCase
		//they could get rather complex
	},
	'identity': function() {
		var m = new TestModel({ id:13 });
		var el = new Element('div');
		el.addClass(m.identity());
		this.assertTrue(el.hasClass('TestModel_13'), 'should return Class + underscore + id');
	},
	'el.get(\'model\')': function() {
		var m = new TestModel({ id:13 });
		var el = new Element('div');
		el.addClass(m.identity());
		this.assertEqual(el.get('model'), m, 'should return the model instance');
	}
}, {
	onSetup: function() {
		window.TestModel = new Class({
			Extends: Model,
			fields: {
				id: Model.Fields.AutoField(),
				title: Model.Fields.TextField()
			}
		});
	},
	onTeardown: function() {
		//delete window.TestModel;
	}
});