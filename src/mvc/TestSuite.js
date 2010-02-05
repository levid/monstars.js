var TestSuite = function(tests) {
	if(TestSuite._sweet) return;
	TestSuite._sweet = true;
	var TESTS = tests;
	for(var t = 0; t < TESTS.length; t++) {
		var testCase = typeof TESTS[t] == 'string' ? window[TESTS[t]] : TESTS[t];
		if(testCase instanceof window.TestCase) {
			testCase.start();
		}
	}
	//$(document.body).grab(new Element('div', { text: casesCount + ' Test Cases.' }));
};