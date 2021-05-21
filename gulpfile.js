
// LIST DEPENDENCIES
const { src, dest, watch, series } = require('gulp');
const gulp = require('gulp');
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const imagewebp = require('gulp-webp');
const browserSync = require('browser-sync').create();

// FUNCTIES MAKEN

//scss (scss naar css omzetten + minify)
function compilescss(){
    /*  Alle scss files in de map src/scss 
     *  omzetten naar css, prefixen en minifien
     *  en tot slot in de folder dist/css plaatsen
     */ 
    return src('src/scss/*.scss')
        .pipe(sass())
        .pipe(prefix())
        .pipe(minify())
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
}

//js (minify js)
function jsmin(){
    /*  Alle javascript files in de map src/js
     *  omzetten met treser
     *  en tot slot in de folder dist/js plaatsen
     */
    return src('src/js/*.js')
        .pipe(terser())
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream());
}

//images (twee functies: één voor optimalisatie en één voor omzetten naar webp)
function optimizeImg(){
    /*  Alle jpg en png files in de map src/images
     *  als jpg dan: qualiteit naar 80% verlagen en progressive aanzetten
     *  (progressive zorgt ervoor dat je de afbeelding ziet inlade, anders zal de afbeelding pas zichtbaar zijn wanneer volledig geladen)
     *  als png dan optimizationLevel 2 gebruiken (een bepaalde standaard compressie)
     *  tot slot in de folder dist/images plaatsen
     */
    return src('src/images/*.{jpg,png}')
        .pipe(imagemin([
            imagemin.mozjpeg({ quality:80, progressive:true }),
            imagemin.optipng({ optimizationLevel: 2 }),
        ]))
        .pipe(dest('dist/images'))
        .pipe(browserSync.stream());
}
//webp (omzetten naar webp formaat)
function webpImg(){
    /*  Alle jpg en png files in dist/images
     *  omzetten naar webp
     *  en in dezelfde map plaatsen
     */
    return src('dist/images/*.{jpg,png}')
        .pipe(imagewebp())
        .pipe(dest('dist/images'))
        .pipe(browserSync.stream());
}

// DE WATCH TASK
function watchTask(){
    /*  Als er veranderingen in de map komen
     *  zal de bijhorende functie worden uitgevoerd
     */
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    watch('src/scss/*.scss',compilescss());
    watch('src/js/*.js',jsmin());
    watch('src/images/*.{jpg,png}',optimizeImg());
    watch('dist/images/*.{jpg,png}',webpImg());
    gulp.watch('./**/*.html').on('change', browserSync.reload); 
    gulp.watch('./js/**/*js').on('change', browserSync.reload);
}


// DEFAULT GULP
/*  Als gulp wordt uitgevoerd zullen de functies standaard worden uitgevoerd
 *  en tot slot ook de watch taak
 */
exports.watchTask = watchTask;