import child_process from 'child_process';
import path from 'path';
import gulp from 'gulp';
import gulpif from 'gulp-if';
import changed from 'gulp-changed';
import babel from 'gulp-babel';
import browserify from 'browserify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import plumber from 'gulp-plumber';
import uglify from 'gulp-uglify';
import less from 'gulp-less';
import cssmin from 'gulp-cssmin';
import imagemin from 'gulp-imagemin';
import es from 'event-stream';
import nodemon from 'gulp-nodemon';
import browserSync from 'browser-sync';
let sync = browserSync.create();

import { verifyManifest } from './manifest.js';

var production = process.env.NODE_ENV === 'production';

// configuration
var config = {
    appDependencies: [
        'react', 'react-dom', 'react-router',
        'alt', 'iso',
        'react-masonry-component', 'react-element-query',
        'react-popover',
        'moment-timezone'
    ],
    utils: {
        babel: {
            presets: ['es2015', 'react']
        },
        imagemin: {
            progressive: true
        },
        browserSync: {
            proxy: 'localhost:3000',
            port: 4000,
        },
        nodemon: {
            script: 'build/server.js',
            watch: [
                'build/**/**.js',
                '!build/**/**.bundle.js',
                '!build/bot/**/**.js'
            ],
            ext: 'js'
        }
    },
    twitterBot: 'build/bot/twitterBot.js',
    publicAssets: ['build/public/**/**.*'],
    js: 'src/**/**.js',
    copyToOutput: {
        directories: [
            'views', 'public/fonts'
        ],
        files: ['public/favicon.ico']
    },
    stylesheets: {
        src: 'src/public/stylesheets/**/**.less',
        entry: 'src/public/stylesheets/main.less',
        outDir: 'build/public/stylesheets'
    },
    images: {
        src: 'src/public/images/**/**.{jpg,png,gif,svg}',
        outDir: 'build/public/images'
    }
};
config.bundles = {
    vendor: {
        require: config.appDependencies,
        output: 'public/vendor.bundle.js'
    },
    app: {
        entry: 'build/app/main.js',
        external: config.appDependencies,
        output: 'public/app.bundle.js'
    }
};

// compile ES2015 JS
function getDestination(src) {
    let rootIndex = src.indexOf("src\\");
    let withoutSrc = path.dirname(
        rootIndex == -1 ? src : src.substring(rootIndex + 4));
    let dest = path.join('build', withoutSrc);

    while ("\\*".includes(dest.charAt(dest.length - 1))) {
        dest = dest.slice(0, -1);
    }
    return dest;
}
function compileJS(src, dest = null) {
    return gulp.src(src)
        .on('error', error => console.error(error))
        .pipe(babel(config.utils.babel))
        .pipe(gulp.dest(dest || getDestination(src)));
}
gulp.task('babel', () => compileJS(config.js, 'build'));

// verify manifest
gulp.task('manifest', ['babel'], () => verifyManifest());

// compile LESS stylesheets
function compileLess(entry) {
    return gulp.src(entry)
        .pipe(plumber())
        .pipe(less())
        .pipe(gulpif(production, cssmin()))
        .pipe(gulp.dest(config.stylesheets.outDir));
}
gulp.task('stylesheets', () => compileLess(config.stylesheets.entry));

// minify images
gulp.task('images', () => {
    return gulp.src(config.images.src)
        .pipe(changed(config.images.outDir))
        .pipe(imagemin(config.utils.imagemin))
        .pipe(gulp.dest(config.images.outDir));
});

// copy files that don't require compilation
function copyDirectory(dir) {
    return gulp.src(`src/${dir}/**/**.*`)
        .on('error', error => console.error(error))
        .pipe(gulp.dest(`build/${dir}`));
}
function copyFile(file) {
    let destination = getDestination(file);
    return gulp.src(`src/${file}`)
        .on('error', error => console.error(error))
        .pipe(gulp.dest(destination));
}
gulp.task('copy', () => {
    let tasks = [];
    tasks.push(...config.copyToOutput.directories.map(dir => copyDirectory(dir)));
    tasks.push(...config.copyToOutput.files.map(dir => copyFile(dir)));
    return es.merge(tasks);
});

// generate bundles
function createBundler({ entry, require, external, output },
    isWatcher = false) {
    let bundler = browserify({
        entries: entry ? [entry] : null,
        cache: {},
        packageCache: {},
        plugin: isWatcher ? [watchify] : null
    });

    if (require) bundler = bundler.require(require);
    if (external) bundler = bundler.external(external);

    let finalBundler = {
        bundler: bundler,
        output: output
    };
    if (isWatcher) {
        // rebundle whenever source files are updated
        bundler.on('update', () => bundle(finalBundler));
    }

    return finalBundler;
}
function bundle({bundler, output}) {
    return bundler.bundle()
        .on('error', error => console.error(error))
        .on('end', () => console.log(`Finished bundling '${output}'.`))
        .pipe(source(output))
        .pipe(buffer())
        .pipe(gulpif(production, uglify({ mangle: false })))
        .pipe(gulp.dest('build'));
}
gulp.task('bundle-vendor', ['babel'],
    () => bundle(createBundler(config.bundles.vendor)));
gulp.task('bundle-app', ['babel'],
    () => bundle(createBundler(config.bundles.app)));

// launch server and auto-restart whenever server code is changed
gulp.task('server', ['build'], callback => {
    var started = false;
    return nodemon(config.utils.nodemon)
        .on('start', () => {
            if (!started) {
                callback();
            }
            started = true;
        })
        .on('restart', files => {
            if (files) {
                let changed = files.map(f => path.basename(f));
                console.log(`Detected changes in '${changed}'. Restarting...`)
            }
        })
        .on('error', error => { throw error; });
});

// run twitter bot
gulp.task('twitter-bot', ['babel', 'copy', 'images'],
    callback => {
        let command = `node ${config.twitterBot}`;
        child_process.exec(command, (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            callback(error);
        });
    });

// initialize BrowserSync
gulp.task('sync', () => {
    sync.init(config.utils.browserSync);
});

// reload browser
gulp.task('reload', () => setTimeout(() => sync.reload(), 500));

// automatically recompile stylesheets
gulp.task('stylesheets-watch', () => {
    gulp.watch([config.stylesheets.src], ['stylesheets']);
});

// automatically minify images
gulp.task('images-watch', () => {
    gulp.watch([config.images.src], ['images']);
});

// automatically recompile JS
gulp.task('babel-watch', () => {
    gulp.watch(config.js).on('change', file => {
        console.log(`recompiling '${file.path}'`);
        compileJS(file.path);
    });
});

// automatically bundle app JS
gulp.task('app-watch', () => {
    let bundler = createBundler(config.bundles.app, true);
    return bundle(bundler);
});

// automatically reload browser whenever public assets change
gulp.task('reload-watch', () => {
    gulp.watch(config.publicAssets, ['reload']);
});

// execute all build tasks
gulp.task('build', [
    'babel', 'manifest',
    'copy', 'stylesheets', 'images',
    'bundle-vendor', 'bundle-app'
]);

// build and start server
gulp.task('serve', ['build', 'server']);

// start BrowserSync and watch for changes
gulp.task('watch', [
    'sync',
    'stylesheets-watch', 'images-watch',
    'babel-watch', 'app-watch',
    'reload-watch'
]);