# image

Responsive image example with [lazysizes](http://afarkas.github.io/lazysizes). Default image ratio is 16:9.

Allowed image widths are defined in [`schema.json`](./schema.json)
The width is taken from rendered container dimension (different screen resolutions are respected and multiplies the width accordingly)

```
["100", "180", "230", "290", "320", "360", "460", "580", "640", "760", "960", "1200", "1496", "1960", "2880", "3920"]
```

## API

Use modifier to change image sizes:

* `.a-image--1x1` (for images with ratio 1x1)
* `.a-image--parent-fit` (image should fit the container completely, independent of image ratio)

## Testing

[Example page](http://localhost:8081/example-patterns)
 
* Initially a loader should be visible
* Image should be loaded on entering the view
* Taken image size depends on your screen resolution and viewport size
