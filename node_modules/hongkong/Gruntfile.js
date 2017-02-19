/**
 * General Grunt setup
 */
'use strict';

/*
 * Call Grunt configuration
 */
module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({});

  // Load project configuration
  grunt.initConfig({
    jshint: {
      all: [
        '*.js',
        'test/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    jasmine: {
      js: {
        src: [
          'node_modules/jquery/dist/jquery.min.js',
          'node_modules/raf.js/raf.min.js',
          'hongkong.js'
        ],
        options: {
          specs: 'test/specs/*.spec.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  /**
   * Testing
   */
  grunt.registerTask('test', [
    'jasmine'
  ]);

  /**
   * Travis CI task
   */
  grunt.registerTask('travis', [
    'jshint',
    'jasmine'
  ]);

};
