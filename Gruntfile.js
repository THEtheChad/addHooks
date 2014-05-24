'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    nodeunit: {
      files: ['test/**/*_test.js'],
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },

    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'nodeunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'nodeunit']
      },
    },

    concat: {
      options: {
        separator: ';',
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */\n' +
          '/**\n' +
          ' * @author  <%= pkg.author.name %>\n' +
          ' * @license <%= pkg.licenses[0].type %>\n' +
          ' * @version <%= pkg.version %>\n' +
          ' * @fileOverview <%= pkg.description %>\n' +
          ' */\n' +
          '\n',
      },
      dist: {
        src: ['lib/**/*.js'],
        dest: 'addHooks.js',
      },
    },

    uglify : {
        js: {
          src: 'addHooks.js',
          dest: 'addHooks.min.js',
        }
    },

    jsdoc : {
        dist : {
            src: 'addHooks.js', 
            dest: 'doc'
        }
    },

    githubPages: {
      target: {
        options: {
          // The default commit message for the gh-pages branch
          commitMessage: 'push'
        },
        // The folder where your gh-pages repo is
        src: 'doc'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jsdoc');

  // Tasks
  grunt.registerTask('default', ['jshint', 'nodeunit', 'concat', 'uglify', 'jsdoc']);
  grunt.registerTask('deploy', ['githubPages:target']);
};
