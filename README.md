# grunt-doxer

dox grunt plugin

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-doxer`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-doxer');
```

Update your [grunt.js gruntfile][getting_started]

```javascript
grunt.initConfig({
	...
	doxer: {
		all: {
			src: ["src/lib/**/*.js"],
			dest: "docs",
			options: {
				format: "html", // or "json" or "md" defaults to html
				title: "Doxer API" // defaults to API
			}
		}
	}
	...
})
```

To generate the API docs, run:

```bash
grunt doxer
```

API docs are in docs directory.

[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].


## License
Copyright (c) 2012 kates  
Licensed under the MIT license.
