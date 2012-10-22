/*
 * grunt-doxer
 * https://github.com/kates/grunt-doxer
 *
 * Copyright (c) 2012 kates
 * Licensed under the MIT license.
 */

var exec = require('child_process').exec,
	fs = require('fs'),
	rimraf = require('rimraf'),
	dox = require("dox");

module.exports = function(grunt) {
	// Please see the grunt documentation for more information regarding task and
	// helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

	// ==========================================================================
	// TASKS
	// ==========================================================================

	grunt.registerMultiTask('doxer', 'api doc generator', function() {
		var files = grunt.file.expandFiles(this.file.src),
			dest = this.file.dest,
			done = this.async(),
			options = this.data.options;

		// Cleanup any existing docs
		rimraf.sync(dest);

		// TODO: there must be a better way than calling `cat`
		exec('cat ' + files.join(' '), function(err, str) {
			grunt.helper("doxer", str, options, function(fname, comments) {
				grunt.file.write(dest + "/" + fname, comments)
				if (!err) {
					done();
				}
			});
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
