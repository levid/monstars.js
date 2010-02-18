var TestCase = new Class({
	
	Implements: [Options, Events, GetClass],
	
	options: {
		onSetup: $empty,
		onTeardown: $empty
	},
	
	_queue: null,
	_current: null,
	_passed: 0,
	_failed: 0,
	_warned: 0,
	_asserts: 0,
	
	initialize: function(tests, options) {
		this.setOptions(options);
		
		this.tests = new Hash(tests);
		
	},
	
	build: function() {
		var box = $('TestBox') || new Element('div', {id: 'TestBox'}).inject($(document.body));
		this.testCaseBox = new Element('div', {
			'class': 'test-case closed',
			id: GetClass.get(this),
			html: '<h2 class="title">'+GetClass.get(this)+'</h2><span class="summary"></span>'
		}).inject(box);
		this.fireEvent('build');
	}.protect(),
	
	conclude: function() {
		var passedCount = new Element('span', { text: this._passed, 'class':'pass' });
		var warnedCount = new Element('span', { text: this._warned, 'class':'warn' });
		var failedCount = new Element('span', { text: this._failed, 'class':'fail' });
		this.testCaseBox.getElement('.summary').grab(passedCount);
		this.testCaseBox.getElement('.summary').grab(warnedCount);
		this.testCaseBox.getElement('.summary').grab(failedCount);		
		if(this._failed) {
			this.testCaseBox.removeClass('closed');
		}
		this.fireEvent('conclude');
	}.protect(),
	
	start: function() {
		this._queue = [];
		this._queue.push(this.build);
		this.tests.each(function(test) {
			if($type(test) != 'function') return;
			//run test
			this._queue.push(function() {
				this.fireEvent('setup');
				test._asserts = [];
				this.run(test);
			});
			//collect test results
			this._queue.push(function() {
				this.results(test);
				this.fireEvent('teardown');
			});
		}, this);
		this._queue.push(this.conclude);
		this.fireEvent('start');
		this.execute();
	},
	
	execute: function() {
		if(this._waitTimeout) return;
		var fn = this._queue.shift();
		fn.apply(this);
		this.fireEvent('execute', fn);
		if(this._queue.length)
			this.execute();
	},
	
	run: function(test) {
		var asserts = this._asserts;
		this._currentTest = test;
		this._currentTestKey = this.tests.keyOf(test);
		try {
			
			test.apply(this);		
		} catch(e) {
			this.assertTrue(false, e);
			if(this._waitTimeout) {
				this.resume();
			}			
		}
	},
	
	wait: function(delay) {
		delay = delay || 10000;
		this._waitTimeout = (function() {
			this.resume();
			this.assertTrue(false, 'Async Test timed out');
		}).delay(delay, this);
		this.fireEvent('wait', this._currentTestKey);
	},
	
	resume: function() {
		this.fireEvent('resume', this._currentTestKey);
		this._waitTimeout = $clear(this._waitTimeout);
		this.execute.delay(1, this);
	},
	
	pass: function(test, title) {
		this._passed++;
		return { status:'pass', msg: (title || this._currentTestKey)  };
	}.protect(),
	
	fail: function(test, error, title) {
		this._failed++;
		return { status:'fail', msg: (title || this._currentTestKey) + ': '+ error };
	}.protect(),
	
	warn: function(test, title) {
		this._warned++;
		return { status:'warn', msg: (title || this._currentTestKey) + ': No Assertions were made.' };
	}.protect(),
	
	results: function(test) {
		var asserts = test._asserts,
			results = [],
			unitStatus = 'pass';
		if(asserts.length) {
			for(var i = 0; i < asserts.length; i++) {
				var a = asserts[i];
				if(a.check) {
					results[i] = this.fail(test, a.failureMsg, a.title);
					unitStatus = results[i].status;
				} else {
					results[i] = this.pass(test, a.title);
				}
			}
		} else {
			results = this.warn(test);
			unitStatus = results.status;
		}
		
		var unitEl = new Element('div', { 'class' : 'unit-test closed '+unitStatus, text: this._currentTestKey });
		$splat(results).each(function(result, i) {
			var testEl = new Element('div', { 'class' : 'test '+result.status, text: result.msg });
			unitEl.grab(testEl);
		});
		this.testCaseBox.grab(unitEl);
	}.protect(),
	
	assert: function(check, failureMsg, title) {
		this._asserts++;
		
		var asserts = this._currentTest._asserts;		
		asserts.push({ check: check, failureMsg: failureMsg, title: title });
		//if(check) throw new AssertionError(failureMsg);
	}.protect(),
	
	assertEqual: function(val1, val2, title) {
		this.assert(val1 != val2, "Actual: " +val1+' , Expected: '+val2, title);
	},
	
	assertIdentity: function(val1, val2, title) {
		this.assert(val1 !== val2, "Actual: " +val1+' , Expected: '+val2, title);
	},
	
	assertTrue: function(val, title) {
		this.assert(!val, val+' is not True', title);
	},
	
	assertFalse: function(val, title) {
		this.assert(val, val+' is not False', title);
	},
	
	assertNull: function(val, title) {
		this.assert(typeof val != 'undefined'&& val !== null, val+' is not null', title);
	}
	
});

window.addEvent('domready', function() {
	$(document.body).addEvents({
		'click:relay(#TestBox .title)': function(e) {
			var title = $(e.target);
			var testCase = title.getParent('.test-case');
			testCase.toggleClass('closed');
		},
		'click:relay(#TestBox .unit-test)': function(e) {
			$(e.target).toggleClass('closed');
		}
	});
});