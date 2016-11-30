import gulp from 'gulp';
import gulpif from 'gulp-if';
import path from 'path';
import babel from 'gulp-babel';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import plumber from 'gulp-plumber';
import uglify from 'gulp-uglify';
import less from 'gulp-less';
import cssmin from 'gulp-cssmin';

// build functions
function files(directory, extension) {
    return path.join(directory, `/**/**.${extension}`);
}

function build(buildTask) {
    return () => {
        var {name, input, src, extension, dest, actions} = buildTask();
        let stream = src && extension ? gulp.src(files(src, extension)) : input;
        if (!stream) {
            console.error("No input or source + extension provided.");
        }
        stream = stream.on('error', error => console.error(`${name}: ${error}`));
        if (actions) {
            actions.forEach(action => {
                stream = stream.pipe(action);
            }, this);
        }
        return stream.pipe(gulp.dest(dest));
    };
}

function watch({directory, extension, tasks}) {
    return () => gulp.watch(files(directory, extension), tasks);
}

// configuration
var production = process.env.NODE_ENV === 'production';

var config = {
    srcDir: 'src',
    outDir: 'build',
    appDependencies: [
        'react', 'react-dom', 'react-router',
        'alt', 'alt-container', 'iso'
    ],
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
config.stylesheets = {
    srcDir: path.join(config.srcDir, 'public/stylesheets'),
    outDir: path.join(config.outDir, 'public/stylesheets')
};

// task definitions
var tasks = {};
tasks.babel = function () {
    return {
        name: 'babel',
        src: config.srcDir,
        extension: "js",
        dest: config.outDir,
        actions: [babel(config.babel)]
    };
}
tasks.stylesheets = function () {
    return {
        name: 'stylesheets',
        src: config.stylesheets.srcDir,
        extension: "less",
        dest: config.stylesheets.outDir,
        actions: [
            plumber(), less(),
            gulpif(production, cssmin())
        ]
    };
};
tasks.copy = function (directoryName) {
    return () => {
        return {
            name: `copy '${directoryName}'`,
            src: path.join(config.srcDir, directoryName),
            extension: "*",
            dest: path.join(config.outDir, directoryName)
        };
    };
};
tasks.bundle = function bundle({ entry, require, external, output }) {
    return () => {
        var bundler = entry ? browserify(entry) : browserify();
        if (require) bundler = bundler.require(require);
        if (external) bundler = bundler.external(external);
        return {
            name: `bundle '${output}'`,
            input: bundler.bundle(),
            dest: config.outDir,
            actions: [
                source(output), buffer(),
                gulpif(production, uglify({ mangle: false }))
            ]
        };
    };
}

// watchers
var watchers = {
    stylesheets: {
        directory: config.stylesheets.srcDir,
        extension: "less",
        tasks: ['stylesheets']
    }
};

// tasks
gulp.task('babel', build(tasks.babel));
gulp.task('views', build(tasks.copy('views')));
gulp.task('fonts', build(tasks.copy('public/fonts')));
gulp.task('stylesheets', build(tasks.stylesheets));
gulp.task('browserify', ['babel'], build(tasks.bundle(config.bundles.app)));
gulp.task('browserify-vendor', ['babel'], build(tasks.bundle(config.bundles.vendor)));

gulp.task('stylesheets-watch', watch(watchers.stylesheets));

gulp.task('core', ['babel', 'views', 'fonts', 'stylesheets']);
gulp.task('build', ['core', 'browserify', 'browserify-vendor']);
gulp.task('default', ['core', 'browserify', 'browserify-vendor', 'stylesheets-watch']);