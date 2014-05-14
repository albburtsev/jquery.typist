module.exports = function(grunt) {
	'use strict';

	require('matchdep')
		.filterDev('grunt-*')
		.forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		jsSource: 'jquery.typist.js',
		banner: 
			'/**\n' +
			' * jquery.typist\n' +
			' * @author Alexander Burtsev, http://burtsev.me, <%= grunt.template.today("yyyy") %>\n' +
			' * @license MIT\n' +
			' */\n',

		jshint: {
			options: {
				globals: {
					jQuery: true
				}
			},
			app: ['<%= jsSource %>']
		},

		jscs: {
			options: {
				config: '.jscs.json'
			},
			app: ['<%= jsSource %>']
		},

		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			typist: {
				files: {
					'jquery.typist.min.js': ['<%= jsSource %>']
				}
			}
		},

		watch: {
			typist: {
				files: ['<%= jsSource %>'],
				tasks: ['jshint', 'jscs', 'uglify']
			}
		}
	});

	grunt.registerTask('default', ['jshint', 'jscs', 'uglify', 'watch']);
};
