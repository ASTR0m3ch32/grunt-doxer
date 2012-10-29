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
		RE_EXT = /\.js$/;

	// Please see the grunt documentation for more information regarding task and
	// helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

	

	var findIndex = function(fPath) {
		var paths = fPath.split("/");
		paths.pop();
		var up = [];
		for (var i = 0; i < paths.length - 1; i++) {
			up.push("..");
		}
		return up.join(path.sep);
	}

	// ==========================================================================
	// TASKS
	// ==========================================================================

	grunt.registerMultiTask('doxer', 'api doc generator', function() {
		var files = grunt.file.expandFiles(this.file.src),
			dest = this.file.dest,
			options = this.data.options || {},
			title = options.title || 'API',
			format = options.format || 'html',
			assetsPath = path.resolve(__dirname, '..', 'assets'),
			tpl = fs.readFileSync(path.resolve(assetsPath, format === 'html' ? 'html.tpl' : 'md.tpl'), 'utf-8').toString(),
			pageTpl = fs.readFileSync(path.resolve(assetsPath, 'page.tpl')).toString(),
			indexTpl = fs.readFileSync(path.resolve(assetsPath, 'index.tpl'), 'utf-8').toString(),
			cssFile = fs.readFileSync(path.resolve(assetsPath, 'bootstrap.css'), 'utf-8');
			

		// cleanup
		rimraf.sync(dest);
		var toc = [];

		grunt.utils.async.forEach(files, function(file, done) {
			var str = grunt.file.read(file, 'utf-8').toString(),
				filePath = dest + path.sep  + file.replace(RE_EXT, '.' + format),
				indexPath = findIndex(filePath),
				cssFilePath = indexPath + path.sep + 'bootstrap.css',
				indexFilePath = indexPath + path.sep + 'index.html';

			grunt.helper('doxer', file, str, options, function(data) {
				if (/md|html/.test(format)) {
					var out = grunt.template.process(tpl,{
							title: title,
							body: data,
							file: file,
							indexFile: indexFilePath,
							cssFile: cssFilePath
					});
					if (format === "html") {
						out = grunt.template.process(pageTpl, {
							content: markdown.parse(out),
							title: title,
							cssFile: cssFilePath
						});

						toc.push({
							path: file.replace(RE_EXT, "." + format),
							target: file
						});
					}
					grunt.file.write(filePath, out);
				} else {
					grunt.file.write(filePath, data);
				}
				
				done(null);
			});
		}, function(err) {});

		if (format === "html") {
			var content = markdown.parse(
				grunt.template.process(indexTpl, {toc: toc, title: title}));

			grunt.file.write(path.resolve(dest, "index.html"),
				grunt.template.process(pageTpl, {
					content: content,
					title: title,
					cssFile: './bootstrap.css'
				})
			);

			grunt.file.write(path.resolve(dest, 'bootstrap.css'), cssFile);
		}
	});

	// ==========================================================================
	// HELPERS
	// ==========================================================================

	grunt.registerHelper('doxer', function(file, str, options, callback) {
		var comments = dox.parseComments(str);
		
		if (/md|html/.test(options.format || 'html')) {
			callback(dox.api(comments));
		} else {
			callback(JSON.stringify(comments));
		}
	});
};
