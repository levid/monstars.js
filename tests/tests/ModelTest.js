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
	'Model.wrap': function() {
		var one = { id: 1, title: 'hey' },
			two = { id: 2, title: 'yo' };
		var model = TestModel.wrap(one),
			models = TestModel.wrap([one, two]);
			
		this.assertEqual($type(model), 'array', 'should always return an array');
		this.assertTrue(model[0] instanceof TestModel, 'should contain instances of the Model');
		this.assertEqual(models[1].get('title'), two.title, 'should have properties set of Model');
		
	},
	'el.get(\'model\')': function() {
		var m = new TestModel({ id:13 });
		TestModel.$cache = {};
		TestModel.$cache[13] = m;
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