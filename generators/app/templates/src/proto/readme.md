# proto

Place non productive code in the corresponding subfolders of this directory. 
Use this for all your development code which never should be on production.

CSS and JavaScript files here are builded with the gulp task `assets-proto`. 
Files placed in the folder `proto` of each pattern are also taken.

You may change the configuration in `compile-css-proto` & `compile-js-proto`.
By changing the configuration take care of the watch-task as well (`watch-assets`).
