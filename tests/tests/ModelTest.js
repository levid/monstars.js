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
		
		m.set('title', null);
		this.assertNull(m.get('title'), 'assigning null to a value should store null, not an empty object of that Type');
	},
	'event onPropertyChange': function() {
		var m = new TestModel({id: 44123, title:'Init Test'});
		var changedProp = null;
		m.addEvent('propertyChange', function(property) {
			changedProp = property;
		});
		
		m.set('title', 'something else');
		this.assertEqual(changedProp, 'title', 'should fire and pass property name when value changes');
		
		changedProp = null;
		m.set('title', m.get('title'));
		this.assertNull(changedProp, 'should not fire if the value stayed the same');
	},
	'propertyChange:property(prop) psuedo': function() {
		var origValue = 'Init Test',
			oldValue = null,
			newValue = null;
		
		var m = new TestModel({id: 44123, title:origValue});
		
		m.addEvent('propertyChange:property(title)', function(newVal, oldVal) {
			oldValue = oldVal;
			newValue = newVal;
		});
		
		var testValue = 'something else';
		m.set('title', testValue);
		this.assertTrue(newValue, 'should fire if property changed matches the value in the psuedo');
		this.assertEqual(newValue, testValue, 'should pass the newValue as first argument');
		this.assertEqual(origValue, oldValue, 'should pass the oldValue as second argument');
		
		newValue = null;
		m.set('id', 5678);
		this.assertNull(newValue, 'should not fire if the changed property doesnt match the value in the psuedo');
	},
	' getWriteableData': function() {
		var GetWriteableDataModel = new Class({
			Extends: Model,
			fields: {
				id: Model.Fields.AutoField(),
				title: Model.Fields.TextField(),
				cantWrite: Model.Fields.TextField({ write: false })
			}
		});
		
		var model = new GetWriteableDataModel({ id: 3, title: 'Poop', cantWrite: 'cant touch this' });
		this.assertEqual(model.get('cantWrite'), 'cant touch this', 'write=false properties can still be read');
		var data = model.getWriteableData();
		this.assertEqual(data.id, model.get('id'), 'should have all writeable properties')
		this.assertEqual(data.title, model.get('title'), 'should have all writeable properties')
		this.assertNotEqual(data.cantWrite, model.get('cantWrite'), 'should NOT have cantWrite');
		
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
			
		this.assertEqual(typeOf(model), 'array', 'should always return an array');
		this.assertTrue(model[0] instanceof TestModel, 'should contain instances of the Model');
		this.assertEqual(models[1].get('title'), two.title, 'should have properties set of Model');
		model[0].set('title', 'yarrrrr');
		this.assertEqual(models[0].get('title'), model[0].get('title'), 'should use the same instance if already in cache');
		
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