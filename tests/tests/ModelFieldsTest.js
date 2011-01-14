var ModelFieldsTest = new TestCase({
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
		
		A.wrap(a1);
		this.assertEqual(b1.get('a').get('id'), a1.get('id'), 'should have same id');
		this.assertEqual(b1.get('a').get('title'), a1.get('title'), 'should have same title');
		
		//this.assertEqual(b1.get('a'), a1, 'should be same instance if in cache');
		
		var a2 = new A({ id: 2, title:'a2'});
		A.wrap(a2);
		
		b1.set('a_id', 2);
		this.assertEqual(b1.get('a').get('title'), 'a2', 'should be able to set prop_id and everything just works');
		
	},
	'ManyToManyField()': function() {
		var A = new Class({
			Extends: Model,
			fields: {
				id: Model.Fields.AutoField()
			}
		});
		
		var B = new Class({
			Extends: Model,
			fields: {
				a: Model.Fields.ManyToManyField(A)
			}
		});
		
		var arr = A.wrap([ { id: 1 }, { id:123 }, { id: 444}]);
		var b1 = new B({ a: arr });
		
		this.assertTrue(b1.get('a') instanceof Array, 'should return an array');
		this.assertEqual(b1.get('a').length, arr.length, 'should be same size as originally inputted array');
		
		this.assertTrue(b1.get('a')[0] instanceof A, 'each item should an instance of the related type');
		this.assertEqual(b1.get('a')[0].get('id'), arr[0].get('id'), 'item should have the same id');
		
		var b2 = new B;
		this.assertTrue(b2.get('a') instanceof Array, 'should return an empty array when nothing has been set');
		this.assertEqual(b2.get('a').length, 0, 'empty array when nothing has been set');
		
		b2.set('a', [ 41, 3, 98, 123]);
		this.assertTrue(b2.get('a')[0] instanceof A, 'passing just numbers should convert them to type with that id');
		this.assertEqual(b2.get('a')[0].get('id'),41, 'should have stored the correct id');
		this.assertEqual(b2.get('a')[3], arr[1], 'should have requested the stored instance from the $cache, if available');
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
		this.assertEqual(+m2.get('timestamp'), +new Date(Date.UTC(2007, 2, 15)), 'should accept YYYY-MM-DD format');
		
		var m3 = new DateModel({ timestamp: '2010-07-29T01:15:16.742000' });
		this.assertEqual(+m3.get('timestamp'), +new Date(Date.UTC(2010,6,29,1,15,16)), 'should accept YYYY-MM-DDTHH:MM:SS.MIRCOSECONDS')
		
	}
}, {
	
});