const {task, dest, src, series, parallel} = require('gulp');
const babel = require('gulp-babel'); //es6转es5
const uglify = require('gulp-uglify'); //压缩js代码
const cleanCSS = require('gulp-clean-css'); //压缩css
const del = require('del');//清空文件夹
const debug = require('gulp-debug'); //编译过程
const rename = require("gulp-rename"); //重命名
const rev = require('gulp-rev'); //打hash值
const revCollector = require('gulp-rev-collector'); //将html中的资源引用 替换为hash
const replace = require('gulp-replace'); //替换插件
// const htmlmin = require('gulp-htmlmin'); //html压缩


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
        // minCss: "distStatic/minCss",
        views: "distViews/",
    },
    // 忽略构建的文件
    ignore: {
        // js忽略压缩的文件
        js: [
            "!static/adminStatic/**/*.js",
            "!static/lib/**/*.js"
        ],
        // css忽略压缩的文件
        css: [
            "!static/lib/**/*.css",
            "!static/adminStatic/**/*.css",
        ]
    }
};

// 克隆static
task("cloneStatic", async function () {
    return await src(config.entryPath.static)
            .pipe(dest(config.outPath.static))
});

// 克隆views
// task("cloneViews", function () {
//     return src("static/**/*")
//             .pipe(dest(config.outPath.views))
// });

task("js", function () {
    return src([config.entryPath.js, ...config.ignore.js])
            .pipe(debug({title: 'js压缩转义：'}))
            .pipe(babel({
                presets: ['@babel/env']
            }))
            .pipe(uglify())
            .pipe(dest(config.outPath.static))
});

// task('css', async function (cb) {
//     return src([config.entryPath.css,...config.ignore.css])
//             .pipe(debug({title: 'css压缩：'}))
//             .pipe(cleanCSS({debug: true}, (details) => {
//                 console.log(`${details.name}: ${details.stats.originalSize}`);
//                 console.log(`${details.name}: ${details.stats.minifiedSize}`);
//             }))
//             .pipe(rename({suffix: ".min",}))
//             .pipe(dest(config.outPath.static))
// });


//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
task('revcss', function(){
    return src([config.entryPath.css,...config.ignore.css])
            .pipe(debug({title: 'css压缩打hash中：'}))
            .pipe(cleanCSS({debug: true}, (details) => {
                console.log(`${details.name}: ${details.stats.originalSize}`);
                console.log(`${details.name}: ${details.stats.minifiedSize}`);
            }))
            .pipe(rev())
            .pipe(dest('./distStatic/rev/css'))
            .pipe(rev.manifest())
            .pipe(dest('./distStatic/rev/css'));
});

//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
task('revjs', function(){
    return src([config.entryPath.js, ...config.ignore.js])
            .pipe(debug({title: 'js压缩转义：'}))
            .pipe(babel({
                presets: ['@babel/env']
            }))
            .pipe(uglify())
            .pipe(rev())                                //给文件添加hash编码
            .pipe(dest('./distStatic/rev/js'))
            .pipe(rev.manifest())                       //生成rev-mainfest.json文件作为记录
            .pipe(dest('./distStatic/rev/js'))
});


//Html替换css、js文件版本
task('revHtmlCssJS', function () {
    return src(['./distStatic/rev/**/*.json', './views/**/*.html'])
            .pipe(debug({title: 'html生成替换引用资源中：'}))
            .pipe(revCollector({
                replaceReved: true,
            }))//替换html中对应的记录
            .pipe(replace(/\bhref\b\s*=\s*[\'\"]?[.]*\/css/g,"href=/rev/css/css/"))
            .pipe(replace(/\bsrc\b\s*=\s*[\'\"]?[.]*\/js/g,"scr=/rev/js/js/"))
            // .pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(dest('./distViews'));//输出到该文件夹中
});


//清除目录
task("clear", async function () {
    let directory = Object.values(config.outPath);
    return await del(directory);
});

task("default", series("clear", "cloneStatic","revcss","revjs","revHtmlCssJS"));