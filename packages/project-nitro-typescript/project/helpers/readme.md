# Custom hbs helpers

If your project needs any additional or custom helpers, place them in this folder. Subdirectories are also allowed  
Every file which has the .js extension will be included.

These helpers will be loaded into Nitro automatically.

An example could look like this:

```js
module.exports = function (foo) {
  // Helper Logic
};
```

The helper name will automatically match the filename, so if you name your file `foo.js` your helper will be called `foo`.
