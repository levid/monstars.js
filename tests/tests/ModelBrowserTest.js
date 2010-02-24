var ModelBrowserTest = new TestCase({
	'save and get': function() {
		var m = new BrowserTestModel(),
			that = this;
		m.set('title', 'Test');
		this.wait(1000);
		m.save(function(m) {
			//that.resume();
			that.assertTrue(m instanceof BrowserTestModel, 'save should provide an instance to the callback');
			var id = m.get('id');
			that.assertTrue(id, 'saving a new Model should set its ID');
			
			
			//that.wait();
			BrowserTestModel.get(id, function(m2) {
				that.resume();
				that.assertTrue(m2 instanceof BrowserTestModel, 'get() should provide an instance to the callback');
			});
		});
	},
	'find': function() {
		var that = this;
		this.wait(1000);
		BrowserTestModel.find({ title: 'Test' }, null, function(models) {
			that.resume();
			that.assertTrue(models instanceof Array, 'should return an array');
			that.assertTrue(models[0] instanceof BrowserTestModel, 'should return Model instances');
			that.assertEqual(models[0].get('title'), 'Test', 'should return Models meeting the condition');
		});
	},
	'findAll': function() {
		var that = this;
		that.wait(1000);
		BrowserTestModel.findAll(function(models) {
			that.resume();
			that.assertTrue(models[0] instanceof BrowserTestModel, 'should return an array of Model instances');
		});
	},
	'destroy': function() {
		var that = this;
		this.wait(1000);
		BrowserTestModel.get(1, function(m) {
			that.assertTrue(m, 'needs a model instance to work')
			m.destroy(function() {
				BrowserTestModel.get(1, function(m2) {
					that.resume();
					that.assertFalse(m2, 'should remove the model from the Store');
				});
			});
		});
	}
});

var BrowserTestModel = new Class({
	Extends: Model.Browser,
	fields: {
		id: Model.Fields.AutoField(),
		title: Model.Fields.TextField()
	}
});