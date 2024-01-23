"use strict";

const gulp = require("gulp");
const webpack = require("webpack-stream");
const browsersync = require("browser-sync");

// const dist = "./dist/";
const dist = "/Desktop/MAMP/htdocs/test";

// Служит для того, чтобы мы могли отслеживать измнения, которые вносим в HTML-файл
gulp.task("copy-html", () => {
  return gulp.src("./src/index.html") // берем по адресу src файл html
    .pipe(gulp.dest(dist)) // после перемещаем в папку dist
    .pipe(browsersync.stream()); // запускаем browsersync, для того, чтобы наша страница перезагрузилась 
});

gulp.task("build-js", () => {
  return gulp.src("./src/js/main.js")
    .pipe(webpack({
      mode: 'development',
      output: {
        filename: 'script.js'
      },
      watch: false,
      devtool: "source-map",
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [['@babel/preset-env', {
                  debug: true,
                  corejs: 3,
                  useBuiltIns: "usage"
                }]]
              }
            }
          }
        ]
      }
    }))
    .pipe(gulp.dest(dist))
    .on("end", browsersync.reload);
});

gulp.task("copy-assets", () => {
  return gulp.src("./src/assets/**/*.*") //  Этот код использует Gulp для выбора файлов, которые должны быть обработаны. 
    // В данном случае, выбраны все файлы (*.*) внутри директории "./src/assets" и всех её поддиректорий (**).
    .pipe(gulp.dest(dist + "/assets")) // тот код указывает Gulp, куда нужно скопировать выбранные файлы. 
    // Файлы копируются в директорию dist (предположительно определенную ранее) и поддиректорию "/assets".
    .on("end", browsersync.reload); //  - Здесь добавлен обработчик события "end", который перезапускает сервер browsersync. 
  //Это может быть полезно, если вы используете browsersync для локальной разработки и хотите автоматически обновлять страницу при изменении файлов.
});

gulp.task("watch", () => {
  browsersync.init({
    server: "./dist/",
    port: 4000,
    notify: true
  });

  gulp.watch("./src/index.html", gulp.parallel("copy-html"));
  gulp.watch("./src/assets/**/*.*", gulp.parallel("copy-assets"));
  gulp.watch("./src/js/**/*.js", gulp.parallel("build-js"));
});

gulp.task("build", gulp.parallel("copy-html", "copy-assets", "build-js"));

gulp.task("build-prod-js", () => {
  return gulp.src("./src/js/main.js")
    .pipe(webpack({
      mode: 'production',
      output: {
        filename: 'script.js'
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [['@babel/preset-env', {
                  corejs: 3,
                  useBuiltIns: "usage"
                }]]
              }
            }
          }
        ]
      }
    }))
    .pipe(gulp.dest(dist));
});

gulp.task("default", gulp.parallel("watch", "build"));