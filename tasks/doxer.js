/*
 * grunt-doxer
 * https://github.com/kates/grunt-doxer
 *
 * Copyright (c) 2012 kates
 * Licensed under the MIT license.
 */


var fs = require('fs'),
	path = require('path'),
	rimraf = require('rimraf'),
	dox = require('dox'),
	markdown = require('github-flavored-markdown');

module.exports = function(grunt) {
	"use strict";
	var RE_PATH = /(.*)?\/.*?\.js$/,
		RE_EXT = /\.js$/,
		INDEX_TEMPLATE = "<h1>API Docs</h1><ul><% for(var i=0; i < toc.length; i++) { %><li><a href=\"<%= toc[i]['path'] %>\"><%= toc[i]['target'] %></a></li><% } %></ul>";

	// Please see the grunt documentation for more information regarding task and
	// helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

	// ==========================================================================
	// TASKS
	// ==========================================================================

	var findIndex = function(fPath) {
		var paths = fPath.split("/");
		paths.pop();
		var up = [];
		for (var i = 0; i < paths.length - 1; i++) {
			up.push("..");
		}
		return up.join(path.sep);
	}

	grunt.registerMultiTask('doxer', 'api doc generator', function() {
		var files = grunt.file.expandFiles(this.file.src),
			dest = this.file.dest,
			options = this.data.options,
			assetPath = path.resolve(__dirname, '..', 'assets'),
			tpl = fs.readFileSync(path.resolve(assetPath, options.format === 'html' ? 'html.tpl' : 'md.tpl')).toString(),
			title = options.title;

		// cleanup
		rimraf.sync(dest);
		var toc = [];

		grunt.utils.async.forEach(files, function(file, done) {
			var str = grunt.file.read(file, "utf-8").toString();

			grunt.helper('doxer', file, str, options, function(data) {
				var filePath = dest + path.sep  + file.replace(RE_EXT, "." + options.format);

				if (/md|html/.test(options.format)) {
					var out = grunt.template.process(tpl,{
							title: title,
							body: data,
							file: file,
							indexFile: findIndex(filePath) + path.sep + "index.html"
					});
					if (options.format === "html") {
						out = markdown.parse(out);
						toc.push({
							path: file.replace(RE_EXT, "." + options.format),
							target: file
						});
					}
					grunt.file.write(filePath, out);
				} else {
					grunt.file.write(filePath, data);
				}
				
				done(null);
			});
			if (options.format === "html") {
				grunt.file.write(path.resolve(dest, "index.html"),
					grunt.template.process(INDEX_TEMPLATE, {toc: toc}));
			}
		}, function(err) {});
	});

	// ==========================================================================
	// HELPERS
	// ==========================================================================

	grunt.registerHelper('doxer', function(file, str, options, callback) {
		var comments = dox.parseComments(str);
		
		if (/md|html/.test(options.format)) {
			callback(dox.api(comments));
		} else {
			callback(JSON.stringify(comments));
		}
	});
};
