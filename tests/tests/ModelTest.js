var ModelTest = new TestCase({
	test_initialize: function() {
		var m = new this.TestModel({id: 44123, title:'Init Test', fake: "Won't Exist"});
		
		this.assertTrue(m instanceof Model);
		this.assertEquals(m.get('id'), 44123);
		this.assertEquals(m.get('title'), 'Init Test');
		this.assertFalse(m.get('fake'));
	},
	test_set: function() {
		var m = new this.TestModel();
		this.assertFalse(m.get('title'));
		
		m.set('title', 'TestTitle');
		this.assertEquals(m.get('title'), 'TestTitle');
		
		m.set({title: 'DifferentTitle'});
		this.assertEquals(m.get('title'), 'DifferentTitle');
	},
	test_fields: function() {
		var FieldModel = new Class({
			Extends: Model,
			fields: {
				id: Model.Fields.AutoField(),
				title: Model.Fields.TextField()
			}
		});
	}
}, {
	onSetup: function() {
		this.TestModel = new Class({
			Extends: Model,
			data: { id:null, title:null }
		});
	},
	onTeardown: function() {
		delete this.TestModel;
	}
});