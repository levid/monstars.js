var ModelTest = new TestCase({
	test_initialize: function() {
		var m = new TestModel({id: 44123, title:'Init Test', fake: "Won't Exist"});
		
		this.assertTrue(m instanceof Model);
		this.assertEqual(m.get('id'), 44123);
		this.assertEqual(m.get('title'), 'Init Test');
		this.assertFalse(m.get('fake'));
	},
	test_set: function() {
		var m = new TestModel();
		this.assertFalse(m.get('title'));
		
		m.set('title', 'TestTitle');
		this.assertEqual(m.get('title'), 'TestTitle');
		
		m.set({title: 'DifferentTitle'});
		this.assertEqual(m.get('title'), 'DifferentTitle');
	},
	test_fields: function() {
		var FieldModel = new Class({
			Extends: Model,
			fields: {
				id: Model.Fields.AutoField(),
				title: Model.Fields.TextField()
			}
		});
	},
	test_identity: function() {
		var m = new TestModel({ id:13 });
		var el = new Element('div');
		el.addClass(m.identity());
		this.assertTrue(el.hasClass('TestModel_13'));
	},
	test_Element_model: function() {
		var m = new TestModel({ id:13 });
		var el = new Element('div');
		el.addClass(m.identity());
		this.assertEqual(el.model(), m);
		this.assertEqual(el.get('model'), m);
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
		delete window.TestModel;
	}
});