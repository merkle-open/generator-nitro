# image

responsive image with lazysizes

Generic image widths are defined and taken for all image ratios (1:1, 3:2). 
The width is taken from rendered container dimension (different screen resolutions are respected and multiplies the width accordingly)

```
["100", "180", "230", "290", "320", "360", "460", "580", "640", "760", "960", "1200", "1496", "1960", "2880", "3920"]
```

## issue

* we use "media" in srcset renditions as container width and "x1" as image src
* sizes 480, 768 & 992 in schema only for backwards compatibility
