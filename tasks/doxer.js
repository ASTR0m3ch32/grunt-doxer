/*
 * grunt-doxer
 * https://github.com/kates/grunt-doxer
 *
 * Copyright (c) 2012 kates
 * Licensed under the MIT license.
 */


var fs = require('fs'),
	rimraf = require("rimraf"),
	dox = require("dox");

module.exports = function(grunt) {
	// Please see the grunt documentation for more information regarding task and
	// helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

	// ==========================================================================
	// TASKS
	// ==========================================================================

	grunt.registerMultiTask('doxer', 'api doc generator', function() {
		var files1 = grunt.file.expandFiles(this.file.src),
			dest = this.file.dest,
			options = this.data.options;

		// cleanup
		rimraf.sync(dest);

		var files = grunt.helper("concat", files1, {separator: ";"});
		grunt.helper("doxer", files, options, function(fname, comments) {
			grunt.file.write(dest + "/" + fname, comments)
		});
	});

	// ==========================================================================
	// HELPERS
	// ==========================================================================

	grunt.registerHelper('doxer', function(str, options, callback) {
		var comments = dox.parseComments(str);
		if (options.format == "api") {
			callback("api.md", dox.api(comments));
		} else {
			callback("api.json", JSON.stringify(comments));
		}
	});
};
