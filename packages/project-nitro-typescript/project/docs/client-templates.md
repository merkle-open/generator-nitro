# Precompiled handlebars templates for Nitro

Precompiled templates allow markup to be precompiled on the server to be used on the client side to render dynamic data.
For this to work you need a handlebars runtime on the client side.

## Generating Templates

### Template source

The templates are generated from all `.hbs` files with are imported in src files.
It's recommended, to place the files in a directory `template` within a pattern.
The template name has not to contain slashes or special characters. Use only names with lowercase letters, dashes and dots.

### Usage

The following js code shows an example how to use a precompiled template.

```
const templateExample = require('../../template/example.hbs');
const tplData = {
    title: 'Client Side Rendered Example Module',
}
const pattern = templateExample(tplData);

$ctx.append($(pattern));
```

## Partials / Helpers

The usage of partials or helpers within a clientside template is possible and as described here:

### Partials

Place your partials in the folder `partial` inside the `template` folder and reference them
in your `.hbs` file (e.g. `{{> partial/example.link}}`)

### Helpers

Require clientside handlebars helpers in your pattern source. You may place them in `template/helper`
or in a shared pattern (e.g in `sr/shared/utils/hbs-helpers`)

## Handlebars versions

Two handlebars versions are in use at the moment. They should have similar versions ;-)

-   One to render views for nitro and to precompile the templates on the server side (`hbs.handlebars` currently 4.0.14)
-   A handlebars runtime to render the precompiled template on the client side (`handlebars` currently 4.1.2)
