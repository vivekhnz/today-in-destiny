import gulp from 'gulp';
import path from 'path';
import babel from 'gulp-babel';
import browserify from 'browserify';
import source from 'vinyl-source-stream';

var config = {
    srcDir: 'src',
    outDir: 'build',
    appDependencies: ['react', 'react-dom'],

    babel: {
        presets: ['es2015', 'react']
    },
    bundles: {}
}

config.bundles.app = {
    entry: path.join(config.outDir, 'app/main.js'),
    external: config.appDependencies,
    output: 'public/app.bundle.js'  
};
config.bundles.vendor = {
    require: config.appDependencies,
    output: 'public/vendor.bundle.js'
};

function files(directory, extension) {
    return path.join(directory, `/**/**.${extension}`);
}

function copy(directoryName) {
    gulp.src(files(path.join(config.srcDir, directoryName), "*"))
        .on('error', error => console.error(error))
        .pipe(gulp.dest(path.join(config.outDir, directoryName)));
}

function bundle({ entry, require, external, output }) {
    var bundler = entry ? browserify(entry) : browserify();
    if (require) bundler = bundler.require(require);
    if (external) bundler = bundler.external(external);
    return bundler.bundle()
        .on('error', error => console.error(error))
        .pipe(source(output))
        .pipe(gulp.dest(config.outDir));
}

gulp.task('babel', () => {
    gulp.src(files(config.srcDir, "js"))
        .on('error', error => console.error(error))
        .pipe(babel(config.babel))
        .pipe(gulp.dest(config.outDir));
});

gulp.task('views', () => copy('views'));
gulp.task('browserify', () => bundle(config.bundles.app));
gulp.task('browserify-vendor', () => bundle(config.bundles.vendor));

gulp.task('default', ['babel', 'views', 'browserify', 'browserify-vendor']);