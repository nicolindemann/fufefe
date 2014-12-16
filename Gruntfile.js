/*global module:false*/
module.exports = function (grunt) {

    grunt.initConfig({

        bower: {
            install: {
                options: {
                    targetDir: './components/',
                    layout: 'byComponent',
                    install: true,
                    copy: true,
                    verbose: true,
                    cleanTargetDir: false,
                    cleanBowerDir: false,
                    bowerOptions: {}
                }
            },
            clean: {
                options: {
                    targetDir: './components/',
                    layout: 'byComponent',
                    install: false,
                    copy: false,
                    cleanTargetDir: true,
                    cleanBowerDir: true
                }
            }
        },

        cssmin: {
            minify: {
                src: 'public/css/style.min.css',
                dest: 'public/css/style.min.css',
                keepSpecialComments: '0'
            }
        },

        jshint: {
            files: ['src/**/*.js', '*.js', '*.json']
        },

        uglify: {
            dist: {
                files: {
                    'public/js/script.min.js': ['public/js/script.min.js'],
                }
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['components/jquery/**/*.js',
                      'components/modernizr/modernizr.js',
                      'components/html2canvas/**/*.js',
                      'src/js/*.js'],
                dest: 'public/js/script.min.js'
            }
        },

        copy: {
            main: {
              files: [
                {src: 'components/normalize-css/normalize.css', dest: 'public/css/style.min.css'},

              ]
            }
          },

        watch: {
          scripts: {
            files: ['src/**/*.*', 'src/*.*'],
            tasks: ['jshint', 'concat',  'cssmin', 'copy'],
            options: {
              spawn: false,
            },
          },
        },

        connect: {
              server: {
                options: {
                  port: 9001,
                  base: './public'
                }
              }
          },

          validation: {
              options: {
                  failHard : true,
                  stoponerror : false,
                  reset: true
              },
              files: {
                  src: ['*.html']
              }
          },


    });

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-travis-lint');
    grunt.loadNpmTasks('grunt-html-validation');

    grunt.registerTask('build', ['bower:install', 'concat', 'uglify', 'copy', 'cssmin', 'bower:clean']);
    grunt.registerTask('dev', ['bower:install', 'concat',  'cssmin', 'copy', 'cssmin', 'connect', 'watch']);
    grunt.registerTask('test', ['jshint', 'travis-lint', 'validation']);


};
