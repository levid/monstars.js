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
	'Model.Fields.ForeignKey': function() {
		var A = new Class({
			Extends: Model,
			fields: {
				id: Model.Fields.AutoField(),
				title: Model.Fields.TextField()
			}
		});
		var B = new Class({
			Extends: Model,
			fields: {
				id: Model.Fields.AutoField(),
				title: Model.Fields.TextField(),
				a: Model.Fields.ForeignKey(A)
			}
		});
		
		var a1 = new A({ id: 1, title: 'a1'});
		var b1 = new B({ id:1, title: 'b1', a: 1 });
		this.assertTrue(b1.get('a'), 'a value should have been stored');
		this.assertTrue(b1.get('a') instanceof A, 'value should be an instance of A');
		this.assertNotEqual(b1.get('a'), a1, 'should create new instance if instance isn\'t in cache');
		
		A.$cache = {};
		A.$cache[a1.get('id')] = a1;
		
		this.assertEqual(b1.get('a'), a1, 'should be same instance if in cache');
		
	},
	'DateField()': function() {
		var DateModel = new Class({
			Extends: Model,
			fields: {
				timestamp: Model.Fields.DateField()
			}
		});
		var now =  new Date()
		var m1 = new DateModel({ timestamp: now });
		this.assertEqual(m1.get('timestamp'), now, 'should accept Date instances');
		
		var m2 = new DateModel({ timestamp: '2007-03-15' });
		this.assertEqual(+m2.get('timestamp'), +new Date(2007, 2, 15), 'should accept YYYY-MM-DD format');
		
		var m3 = new DateModel({ timestamp: '2010-07-29T01:15:16.742000' });
		this.assertEqual(+m3.get('timestamp'), +new Date(2010,6,29,1,15,16), 'should accept YYYY-MM-DDTHH:MM:SS.MIRCOSECONDS')
		
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