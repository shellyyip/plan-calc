module.exports = function(grunt) {
	// Configure tasks
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		watch : {
			options : {
				livereload : true,//needs LiveReload Chrome extension to be turned on
			},
			scripts : {
				files : ['scss/*', '*.html', 'm-scss/*','*.js'],
				tasks : ['sass', 'autoprefixer'],
				options : {
					spawn : false,
				}
			},
		},
		sass : {// Task
			dist : {// Target
				options : {// Target options
					style : 'compressed'
				},
				files : {// Dictionary of files
					'scss/sass-compiled.css' : 'scss/main.scss',
					'm-scss/sass-compiled.css' : 'm-scss/main.scss'
				}
			}
		},
		autoprefixer : {
			dist : {
				files : {
					'style.css' : 'scss/sass-compiled.css',
					'm-style.css' : 'm-scss/sass-compiled.css',
				}
			}
		}
	});

	// Where we tell Grunt we plan to use this plug-in.
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-autoprefixer');
	// Where we tell Grunt what to do when we type "grunt" into the terminal.
	grunt.registerTask('default', ['watch', 'sass', 'autoprefixer']);

};
