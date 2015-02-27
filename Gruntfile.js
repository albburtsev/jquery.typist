module.exports = function(grunt) {
	'use strict';

	require('matchdep')
		.filterDev('grunt-*')
		.forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		jsSource: 'src/*.js',
		jsDist: 'dist/',
		banner: 
			'/**\n' +
			' * jquery.typist — animated text typing\n' +
			' * @author Alexander Burtsev, http://burtsev.me, 2014—<%= grunt.template.today("yyyy") %>\n' +
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

		copy: {
			options: {
				process: function (content, srcpath) {
					return grunt.config.get('banner') + content;
				}
			},
			source: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['**'],
					dest: 'dist/'
				}]
			}
		},

		uglify: {
			options: {
				banner: '<%= banner %>',
				sourceMap: true
			},
			typist: {
				files: {
					'<%= jsDist %>jquery.typist.min.js': ['<%= jsSource %>']
				}
			}
		},

		watch: {
			typist: {
				files: ['<%= jsSource %>'],
				tasks: ['jshint', 'jscs', 'copy', 'uglify']
			}
		}
	});

	grunt.registerTask('default', ['jshint', 'jscs', 'copy', 'uglify', 'watch']);
};
