(function() {

var AssertionError = new Class({
	initialize: function(msg) {
		this.message = msg;
	},
	toString: function() {
		return this.message;
	}
});

this.TestCase = new Class({
	
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
		this.testBox = new Element('div', {
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
		//if(this._passed)
			this.testBox.getElement('.summary').grab(passedCount);
		//if(this._warned)
			this.testBox.getElement('.summary').grab(warnedCount);
		
			this.testBox.getElement('.summary').grab(failedCount);		
		if(this._failed) {
			this.testBox.removeClass('closed');
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
			/*if(e instanceof AssertionError) {
				this.fail(test, e);
				if(this._waitTimeout) {
					this.resume();
				}
			} else {
				throw e;
			}*/
			
		}
	},
	
	wait: function(delay) {
		delay = delay || 10000;
		this._waitTimeout = (function() {
			this.resume();
			this.fail(this._currentTest, 'Async Test timed out');
		}).delay(delay, this);
		this.fireEvent('wait', this._currentTestKey);
	},
	
	resume: function() {
		this.fireEvent('resume', this._currentTestKey);
		this._waitTimeout = $clear(this._waitTimeout);
		this.execute.delay(1, this);
	},
	
	pass: function(test) {
		this._passed++;
		return { status:'pass', msg: 'Passed: ' + this._currentTestKey };
	}.protect(),
	
	fail: function(test, error) {
		this._failed++;
		return { status:'fail', msg: 'Failed: '+ this._currentTestKey +' - '+ error };
	}.protect(),
	
	warn: function(test) {
		this._warned++;
		return { status:'warn', msg: 'Warn: '+ this._currentTestKey +' - No Assertions were made.' };
	}.protect(),
	
	results: function(test) {
		var asserts = test._asserts,
			results;
		if(asserts.length) {
			for(var i = 0; i < asserts.length; i++) {
				var a = asserts[i];
				if(a.check) {
					results = this.fail(test, a.failureMsg);
					break;
				}
			}
			if(!results) {
				results = this.pass(test);
			}
		} else {
			results = this.warn(test);
		}
		
		var resEl = new Element('div', { 'class' : 'unit-test '+results.status, text: results.msg });
		this.testBox.grab(resEl);
	}.protect(),
	
	assert: function(check, failureMsg, title) {
		this._asserts++;
		
		var asserts = this._currentTest._asserts;		
		asserts.push({ check: check, failureMsg: failureMsg, title: title });
		//if(check) throw new AssertionError(failureMsg);
	}.protect(),
	
	assertEqual: function(val1, val2) {
		this.assert(val1 != val2, "Actual: " +val1+' , Expected: '+val2);
	},
	
	assertIdentity: function(val1, val2) {
		this.assert(val1 !== val2, "Actual: " +val1+' , Expected: '+val2);
	},
	
	assertTrue: function(val) {
		this.assert(!val, val+' is not True');
	},
	
	assertFalse: function(val) {
		this.assert(val, val+' is not False');
	},
	
	assertNull: function(val) {
		this.assert(typeof val != 'undefined'&& val !== null, val+' is not null');
	}
	
});
})();

window.addEvent('domready', function() {
	$(document.body).addEvent('click:relay(#TestBox .title)', function(e) {
		var title = $(e.target);
		var testCase = title.getParent('.test-case');
		testCase.toggleClass('closed');
	});
});