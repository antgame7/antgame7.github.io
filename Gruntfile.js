
module.exports = function (grunt) {
    grunt.initConfig({
        sass: {
            dist: {
                files: {
                    'Dist/styles/style.css': 'Dev/styles/style.scss'
                }
            }
        },
        concat_css: {
            all: {
                src: ['Dev/styles/vendor/*.css', 'Dist/styles/style.css'],
                dest: 'Dist/styles/style.css'
            },
        },
        concat: {
            scripts: {
                files: {
                    'Dist/scripts/fouc.js': ['Dev/scripts/vendor/modernizr.js', 'Dev/scripts/vendor/detectizr.js', 'Dev/scripts/foucInit.js'],
                    'Dist/scripts/main.js': [
                        'Dev/scripts/vendor/jquery-1.11.3.min.js',

                        'Dev/scripts/vendor/build/three_v71.js',
                        'Dev/scripts/vendor/renderers/Projector.js',
                        'Dev/scripts/vendor/renderers/CanvasRenderer.js',
                        'Dev/scripts/vendor/custom/eventemitter.js',
                        'Dev/scripts/vendor/custom/eventie.js',
                        'Dev/scripts/vendor/custom/imagesloaded.js',
                        'Dev/scripts/vendor/custom/ease.js',
                        'Dev/scripts/vendor/custom/flow.js',
                        'Dev/scripts/vendor/custom/particle.position.js',
                        'Dev/scripts/vendor/custom/particles.js',
                        'Dev/scripts/vendor/libs/stats.min.js',
                        'Dev/scripts/vendor/libs/tween.min.js',
                        'Dev/scripts/graphics.js',

                        'Dev/scripts/main.js'
                    ]
                }
            }

        },
        uglify: {
            dist: {
                files: {
                    'Dist/scripts/main.min.js': ['Dist/scripts/main.js']
                }
            }
        },
        cssmin: {
            dist: {
                options: {
                    keepSpecialComments: 0
                },
                files: {
                    'Dist/styles/style.min.css': ['Dist/styles/style.css']
                }
            }
        },
        postcss: {
            options: {
                map: false,
                failOnError: false,
                processors: [
                    require('autoprefixer')({
                        browsers: ['> 1%', 'ie >= 7']
                    }),
                    require('postcss-opacity'),
                    require('postcss-color-rgba-fallback')
                ]
            },
            dist: {
                src: 'Dist/styles/style.css',
                dest: 'Dist/styles/style.css'
            }
        },

        watch: {
            styles: {
                files: ['Dev/styles/**/*.scss'],
                tasks: ['sass', 'concat_css', 'postcss'],
                options: {
                    spawn: false
                }
            },
            scripts: {
                files: ['Dev/scripts/**/*.js'],
                tasks: ['concat']
            }
        }
    });


    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-postcss");
    grunt.loadNpmTasks("grunt-newer");

    grunt.registerTask("default", ["newer:sass", "newer:concat_css", "newer:concat", "newer:postcss", "watch"]);
    grunt.registerTask("all", ["sass", "concat_css", "concat", "postcss"]);
    grunt.registerTask("dist", ["uglify", "cssmin"]);

}