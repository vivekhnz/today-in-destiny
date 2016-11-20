import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';

var config = {
    babel: {
        presets: ['es2015']
    },
    js: {
        src: './app/main.js',
        outputFilename: 'bundle.js',
        outputDir: './public/js'
    }
};

gulp.task('browserify', () => {
    var bundler = browserify(config.js.src);
    bundler.transform(babelify, config.babel);

    bundler.bundle()
        .on('error', error => console.error(error))
        .pipe(source(config.js.outputFilename))
        .pipe(gulp.dest(config.js.outputDir));
});

gulp.task('default', ['browserify']);