var GetClassTest = new TestCase({
	test_mixin: function() {
		this.assertEquals(this.get_class(), 'TestCase');
	},
	test_static: function() {
		this.assertEquals(GetClass.get(Model), 'Model');
		this.assertEquals(GetClass.get(Controller), 'Controller');
		
	},
	test_in_namespaces: function() {
		this.assertEquals(GetClass.get(Model.Ajax), 'Model.Ajax');
	},
	test_this: function() {
		this.assertEquals(GetClass.get(this), 'GetClassTest');
	},
	test_in_closures: function() {
		var Closed = {};
		this.assertEquals(GetClass.get(Closed), 'Closed');
	}
});