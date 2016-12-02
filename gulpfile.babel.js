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
import es from 'event-stream';
import nodemon from 'gulp-nodemon';
import browserSync from 'browser-sync';
let sync = browserSync.create();

var production = process.env.NODE_ENV === 'production';

function join(base, paths) {
    return paths.map(fn => path.join(base, fn));
}

// configuration
var config = {
    appDependencies: [
        'react', 'react-dom', 'react-router',
        'alt', 'alt-container', 'iso'
    ],
    publicAssets: ['build/public/**/**.*'],
    utils: {
        babel: {
            presets: ['es2015', 'react']
        },
        browserSync: {
            proxy: 'localhost:3000',
            port: 4000,
        }
    },
    copyToOutput: [
        'views', 'public/fonts'
    ],
    stylesheets: {
        src: 'src/public/stylesheets/**/**.less',
        outDir: 'build/public/stylesheets'
    },
    server: {
        entry: 'build/server.js',
        dependencies: [
            'server.js', 'routes.js', 'services/**/**.js'
        ]
    }
}
config.js = {
    all: 'src/**/**.js',
    server: join('src', config.server.dependencies)
};
config.server.nodemon = {
    script: config.server.entry,
    watch: join('build', config.server.dependencies),
    ext: 'js',
    delay: 2000
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
gulp.task('babel-server', () => {
    return es.merge(config.js.server.map(dep => compileJS(dep)));
});
gulp.task('babel-app', () => {
    let sources = config.js.server.map(dep => `!${dep}`);
    sources.splice(0, 0, config.js.all);
    return compileJS(sources, 'build');
});
gulp.task('babel-all', ['babel-server', 'babel-app']);

// compile LESS stylesheets
gulp.task('stylesheets', () => {
    return gulp.src(config.stylesheets.src)
        .pipe(plumber())
        .pipe(less())
        .pipe(gulpif(production, cssmin()))
        .pipe(gulp.dest(config.stylesheets.outDir));
});

// copy files that don't require compilation
function copy(dir) {
    return gulp.src(`src/${dir}/**/**.*`)
        .on('error', error => console.error(error))
        .pipe(gulp.dest(`build/${dir}`));
}
gulp.task('copy', () => {
    return es.merge(config.copyToOutput.map(dir => copy(dir)));
});

// generate bundles
function bundle({ entry, require, external, output }) {
    var bundler = entry ? browserify(entry) : browserify();
    if (require) bundler = bundler.require(require);
    if (external) bundler = bundler.external(external);
    return bundler.bundle()
        .on('error', error => console.error(error))
        .pipe(source(output))
        .pipe(buffer())
        .pipe(gulpif(production, uglify({ mangle: false })))
        .pipe(gulp.dest('build'));
}
gulp.task('bundle-vendor', ['babel-app'], () => bundle(config.bundles.vendor));
gulp.task('bundle-app', ['babel-app'], () => bundle(config.bundles.app));

// launch server and auto-restart whenever server code is changed
gulp.task('server', ['build'], callback => {
    var started = false; 
    return nodemon(config.server.nodemon)
        .on('start', () => {
            if (!started) {
                callback();
            }
            started = true;
        })
        .on('error', error => { throw error; });
});

// initialize BrowserSync
gulp.task('sync', () => {
    sync.init(config.utils.browserSync);
});

// reload browser
gulp.task('reload', () => sync.reload());

// automatically recompile stylesheets
gulp.task('stylesheets-watch', () => {
    gulp.watch([config.stylesheets.src], ['stylesheets']);
});

// automatically recompile server JS
gulp.task('server-watch', () => {
    gulp.watch(config.js.server, ['babel-server']);
});

// automatically reload browser whenever public assets change
gulp.task('reload-watch', () => {
    gulp.watch(config.publicAssets, ['reload']);
});

// execute all build tasks
gulp.task('build', [
    'babel-all', 'copy', 'stylesheets', 'bundle-vendor', 'bundle-app'
]);

// build and start server
gulp.task('serve', ['build', 'server']);

// start BrowserSync and watch for changes
gulp.task('watch', [
    'sync', 'stylesheets-watch', 'server-watch', 'reload-watch'
]);