const {task, dest, src, series} = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const del = require('del');

const config = {
    // 入口
    entryPath: {
        static: "static/**/*",
        js: "static/**/*.js",
        css: "static/**/*.css",
        html: "views/**/*.html",
    },
    // 出口
    outPath: {
        static: "distStatic/",
        views: "distViews/",
    },
    // 忽略构建的文件
    ignore: {
        js: [
            "!static/adminStatic/**/*.js",
            "!static/lib/**/*.js"
        ]
    }
};

// 克隆static
// task("cloneStatic", function () {
//     return src(config.entryPath.static)
//             .pipe(dest(config.outPath.static))
// });

// 克隆views
// task("cloneViews", function () {
//     return src("static/**/*")
//             .pipe(dest(config.outPath.views))
// });

task("js", function () {
    return src([config.entryPath.js,...config.ignore.js])
            .pipe(babel({
                presets: ['@babel/env']
            }))
            .pipe(uglify())
            .pipe(dest(config.outPath.static))
});

//清除目录
task("clear", async function () {
    let directory = Object.values(config.outPath);
    return await del(directory);
});

// task("default", series("clear","cloneStatic", "cloneViews"));
task("default", series("clear", "js"));