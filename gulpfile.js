const gulp = require("gulp");
const cleanCSS = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
// const imageResize = require("gulp-image-resize");
const decomment = require("gulp-decomment");
const uglify = require("gulp-uglify");
const pump = require("pump");

gulp.task("default", ["watch"]);

gulp.task("build", ["build:css", "build:js"]);

gulp.task("build:css", cb => {
    pump([
        gulp.src("css/*.css"),
        decomment({trim: true}),
        cleanCSS({
            compatibility: "ie8",
            rebase: false
        }),
        gulp.dest("css/")
    ], cb);
});

gulp.task("build:js", cb => {
    pump([
        gulp.src("js/*.js"),
        decomment({trim: true}),
        uglify(),
        gulp.dest("js/")
    ], cb);
});

gulp.task("compress:images", cb => {
    pump([
        gulp.src("images/**/*"),
        imagemin([
            // TODO: Improve configurations to minimize even more
            imagemin.jpegtran({progressive: true}),
            imagemin.svgo({
                plugins: [
                    {cleanupIDs: false},
                    {minifyStyles: true},
                    {removeComments: true},
                    {removeViewBox: true}
                ]
            })
        ],
        {verbose: true}),
        gulp.dest("images/")
    ], cb);
});

gulp.task("watch", ["watch:css", "watch:js"]);

gulp.task("watch:css", () => gulp.watch("css/", ["build:css"]));

gulp.task("watch:js", () => gulp.watch("js/", ["build:js"]));

gulp.task("watch:images", () => gulp.watch("images/", ["compress:images"]));