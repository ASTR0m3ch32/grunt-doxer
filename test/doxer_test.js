var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['doxer'] = {
	setUp: function(done) {
	// setup here
		done();
	},
	'json': function(test) {
		var str = "/**\n* @param {String} the param\n* @return {String} result\n*/\nfunction dummy(str) { return str;}";

		grunt.helper('doxer', "api.js", str, {format: "json"}, function(fname, comments) {
			var commentsJson = JSON.parse(comments);
			test.equal(commentsJson[0]["ctx"]["name"], "dummy")
			test.done();
		});
	},
	'api': function(test) {
		var str = "/**\n* @param {String} the param\n* @return {String} result\n*/\nfunction dummy(str) { return str;}";

		grunt.helper('doxer', "api.js", str, {format: "api"}, function(fname, comments) {
			test.ok((/^### dummy\(\)/).test(comments));
			test.done();
		});
	}
};
