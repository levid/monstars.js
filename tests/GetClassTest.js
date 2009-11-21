var GetClassTest = new TestCase({
	test_mixin: function() {
		this.assertEquals(this.get_class(), 'TestCase');
	},
	test_static_getName: function() {
		this.assertEquals(GetClass.getName(Model), 'Model');
		this.assertEquals(GetClass.getName(Controller), 'Controller');
		
	},
	test_static_getClass: function() {
		this.assertEquals(GetClass.get_class(this), 'TestCase');
	},
	test_in_namespaces: function() {
		this.assertEquals(GetClass.getName(Model.Ajax), 'Model.Ajax');
	},
	test_in_closures: function() {
		var Closed = { $name: 'Closed' };
		this.assertEquals(GetClass.getName(Closed), 'Closed');
	}
});