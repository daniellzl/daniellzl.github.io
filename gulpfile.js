// =============================================================================
// Source Files
// =============================================================================

const scripts = {
    daniel: [
        'src/js/index.js'
    ],
    vendor: [
        'node_modules/uikit/dist/js/uikit.js',
        'node_modules/uikit/dist/js/uikit-icons.js',
        // 'src/js/readable-vanilla.js'
    ]
};

const styles = {
    daniel: [
        'src/scss/index.scss'
    ],
    vendor: [
        'node_modules/uikit/dist/css/uikit.css',
        // 'src/css/readable.css'
    ]
};

// =============================================================================
// Tasks
// =============================================================================

const gulp       = require('gulp'),
    htmlmin      = require('gulp-htmlmin'),
    cleanCSS     = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify       = require('gulp-uglify'),
    sass         = require('gulp-sass'),
    sourcemaps   = require('gulp-sourcemaps'),
    rename       = require('gulp-rename'),
    util         = require('gulp-util'),
    concat       = require('gulp-concat');

gulp.task('minify html', () => {
    gulp.src('src/index.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('bundle styles - development', () => {
    gulp.src(styles.vendor)
        .pipe(concat('vendor.bundle.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css'));
    gulp.src(styles.daniel)
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename('daniel.bundle.css'))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('bundle styles - production', () => {
    gulp.src(styles.vendor)
        .pipe(concat('vendor.bundle.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest('dist/css'));
    gulp.src(styles.daniel)
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(rename('daniel.bundle.css'))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('bundle scripts - development', () => {
    gulp.src(scripts.vendor)
        .pipe(concat('vendor.bundle.js', {
            newLine: ';'
        }))
        .pipe(gulp.dest('dist/js'));
    gulp.src(scripts.daniel)
        .pipe(concat('daniel.bundle.js', {
            newLine: ';'
        }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('bundle scripts - production', () => {
    gulp.src(scripts.vendor)
        .pipe(concat('vendor.bundle.js', {
            newLine: ';'
        }))
        .pipe(uglify()).on('error', function(err) {
            util.log(util.colors.red('[Error]'), err.toString());
            this.emit('end');
        })
        .pipe(gulp.dest('dist/js'));
    gulp.src(scripts.daniel)
        .pipe(concat('daniel.bundle.js', {
            newLine: ';'
        }))
        .pipe(uglify()).on('error', function(err) {
            util.log(util.colors.red('[Error]'), err.toString());
            this.emit('end');
        })
        .pipe(gulp.dest('dist/js'));
});

// =============================================================================
// Main Tasks
// =============================================================================

gulp.task('prod', [
    'bundle styles - production',
    'bundle scripts - production',
    'minify html'
]);

gulp.task('dev', [
    'bundle styles - development',
    'bundle scripts - development'
]);

gulp.task('watch', () => {
    gulp.watch(['src/scss/*.scss', 'src/scss/**/*.scss', 'src/scss/**/**/*.scss', 'src/styles.js'], ['bundle styles - development']);
    gulp.watch(['src/js/*.js', 'src/scripts.js'], ['bundle scripts - development']);
});
