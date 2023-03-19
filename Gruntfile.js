module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		ebDeploy: {
			options: {
				application: 'sustainergy',
			},
			dev: {
				options: {
					environment: 'sustainergy-dashboard-frontend-stg-env'
				},
				files: [
					{ src: ['.ebextensions/*'] },
					{ cwd: 'dist/', src: ['**'], expand: true }
				]
			},
			prod: {
				options: {
					environment: 'sustainergy-dashboard-frontend-prod-env'
				},
				files: [
					{ src: ['.ebextensions/*'] },
					{ cwd: 'dist/', src: ['**'], expand: true }
				]
			},
		},
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	grunt.registerTask('default', ['uglify']);

};


