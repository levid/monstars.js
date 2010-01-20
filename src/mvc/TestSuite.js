var TestSuite = function(tests) {
	if(TestSuite._sweet) return;
	TestSuite._sweet = true;
	var casesCount = 0;
	var TESTS = tests;
	for(var T in TESTS) {
		if(!TESTS.hasOwnProperty(T)) continue;
		var testCase = typeof TESTS[T] == 'string' ? window[TESTS[T]] : TESTS[T];
		if(testCase instanceof window.TestCase) {
			testCase.run();
			casesCount++;
		}
	}
	$(document.body).grab(new Element('div', { text: casesCount + ' Test Cases.' }));
};