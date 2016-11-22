import gulp from 'gulp';
import path from 'path';
import babel from 'gulp-babel';
import browserify from 'browserify';
import source from 'vinyl-source-stream';

function files(directory, extension) {
    return path.join(directory, `/**/**.${extension}`);
}

function copy(directoryName) {
    gulp.src(files(path.join(config.srcDir, directoryName), "*"))
        .pipe(gulp.dest(path.join(config.outDir, directoryName)));
}

var config = {
    srcDir: 'src',
    outDir: 'build',
    
    babel: {
        presets: ['es2015', 'react']
    },
    browserify: {
        entry: 'app/main.js',
        output: 'public/bundle.js'
    }
};

gulp.task('babel', () => {
    gulp.src(files(config.srcDir, "js"))
        .pipe(babel(config.babel))
        .pipe(gulp.dest(config.outDir));
});

gulp.task('views', () => copy('views'));

gulp.task('browserify', () => {
    var entryPoint = path.join(config.outDir, config.browserify.entry);
    browserify(entryPoint)
        .bundle()
        .on('error', error => console.error(error))
        .pipe(source(config.browserify.output))
        .pipe(gulp.dest(config.outDir));
});

gulp.task('default', ['babel', 'views', 'browserify']);