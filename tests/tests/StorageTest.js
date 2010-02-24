(function() {

var testStorageAPI = function(store) {
	store.clear();
	
	var value = 'poop';
	store.setItem('test', value);
	store.setItem('other', value);
	
	this.assertEqual(store.getItem('test'), value, 'setItem and getItem should be able to retrieve a value with same key');
	this.assertTrue($chk(store.key(0)), 'key() will return the key from a given index');
	this.assertEqual(store.length(), 2, 'length should be 2 after adding 2 items')
	
	store.removeItem('other');
	this.assertFalse($chk(store.getItem('other')), 'removeItem(key) should delete the key/value from the store');
	this.assertEqual(store.length(), 1, 'length should be 1 now after removing 1 item');
	
	store.clear();
	this.assertEqual(store.length(), 0, 'length should be 0 after clearing Store');
	this.assertFalse($chk(store.getItem('test')), 'all key/value pairs should be gone after clear()');
};

this.StorageTest = new TestCase({
	'singleton': function() {
		var store1 = new Storage();
		var store2 = new Storage();
		this.assertEqual(store1, store2, 'constructor should always return the same instance');
	},
	'local store': function() {
		var store = new Storage('local');
		testStorageAPI.call(this, store);
	},
	'session store': function() {
		var store = new Storage('session');
		testStorageAPI.call(this, store);
	},
	'storing objects': function() {
		var store = new Storage('local'),
			value = { a: 'one', 2: 'b', 'three': [1,2,4] };
			
		store.setItem('test', value);
		
		var test = store.getItem('test');
		
		this.assertEqual(test.a, value.a, 'should be able to store whole Objects');
		this.assertEqual(test[2], value[2], 'should be able to store whole Objects');
		this.assertEqual(test.three[0], value.three[0], 'should be able to store whole Objects');
	}
});

})();