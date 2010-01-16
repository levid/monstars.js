var TestCase = new Class({
	
	Implements: [Options, Events, GetClass],
	
	options: {
		onSetup: $empty,
		onTeardown: $empty
	},
	
	_passed: 0,
	_failed: 0,
	_warned: 0,
	_asserts: 0,
	
	initialize: function(tests, options) {
		this.setOptions(options);
		
		this.tests = tests;
		
	},
	
	build: function() {
		var box = $('TestBox') || new Element('div', {id: 'TestBox'}).inject($(document.body));
		this.testBox = new Element('div', {
			'class': 'test-case closed',
			id: GetClass.get(this),
			html: '<h2 class="title">'+GetClass.get(this)+'</h2><span class="summary"></span>'
		}).inject(box);
		
	}.protect(),
	
	conclude: function() {
		var passedCount = new Element('span', { text: this._passed, 'class':'pass' });
		var warnedCount = new Element('span', { text: this._warned, 'class':'warn' });
		var failedCount = new Element('span', { text: this._failed, 'class':'fail' });
		//if(this._passed)
			this.testBox.getElement('.summary').grab(passedCount);
		//if(this._warned)
			this.testBox.getElement('.summary').grab(warnedCount);
		
			this.testBox.getElement('.summary').grab(failedCount);		
		if(this._failed) {
			this.testBox.removeClass('closed');
		}
	}.protect(),
	
	run: function() {
		this.build();
		var tests = this.tests;
		for(var test in tests) {
			if(!tests.hasOwnProperty(test) || $type(tests[test]) != 'function') continue;
			
			this.fireEvent('setup');
			try {
				var asserts = this._asserts;
				tests[test].apply(this);
				var noAsserts = !(this._asserts - asserts);
				if(noAsserts) {
					this.warn(test);
				} else {
					this.pass(test);
				}				
			} catch(e) {
				this.fail(test, e);
			}
			this.fireEvent('teardown');
		}
		this.conclude();
	},
	
	pass: function(test) {
		this.results('pass', 'Passed: ' + test);
		this._passed++;
	}.protect(),
	
	fail: function(test, error) {
		this.results('fail', 'Failed: '+ test +' - '+ error);
		this._failed++;
	}.protect(),
	
	warn: function(test) {
		this.results('warn', 'Warn: '+ test +' - No Assertions were made.');
		this._warned++;
	}.protect(),
	
	results: function(status, msg) {
		var res = new Element('div', {'class': 'test '+status, text: msg});
		//res.grab(new Element('pre', { html: '<code></code>' }))
		this.testBox.grab(res);
	}.protect(),
	
	assertEqual: function(val1, val2) {
		if(val1 != val2) throw new Error("Actual: " +val1+' , Expected: '+val2);
		this._asserts++;
	}.protect(),
	
	assertIdentity: function(val1, val2) {
		if(val1 !== val2) throw new Error("Actual: " +val1+' , Expected: '+val2);
		this._asserts++;
	}.protect(),
	
	assertTrue: function(val) {
		if(!val) throw new Error(val+' is not True');
		this._asserts++;
	}.protect(),
	
	assertFalse: function(val) {
		if(val) throw new Error(val+' is not False');
		this._asserts++;
	}.protect(),
	
	assertNull: function(val) {
		if(val !== null && typeof val != 'undefined') throw new Error(val+' is not null');
		this._asserts++;
	}
	
});

window.addEvent('domready', function() {
	$(document.body).addEvent('click:relay(#TestBox .title)', function(e) {
		var title = $(e.target);
		var testCase = title.getParent('.test-case');
		testCase.toggleClass('closed');
	});
});