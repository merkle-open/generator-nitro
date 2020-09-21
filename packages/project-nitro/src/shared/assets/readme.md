# Assets

Images in the folder `img` will be minified and copied to `/public/assets/img` by the gulp task "minify-images".

In views you can use them with "/assets/img/" or the asset helper if available: `<img src="{{asset name='/img/logo.png'}}" alt="" />`

[Configuration](../../../config/default/gulp.js)
