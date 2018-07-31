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

## Patterns / Partials / helpers

The usage of patterns, partials or helpers within a clientside template is possible and as described here: 

### Patterns

If you want to use the code of a serverside pattern unchanged within your clientside template you may use the nitro `pattern` helper for this. 

```<% if (options.templateEngine === 'twig') { %>
{% pattern name='icon' data='icon' %}<% } else { %>
{{pattern name='icon' data='icon'}}
<% } %>
```

This call can be placed within a clientside template and get's resolved during pre-compilation.<% if (options.templateEngine === 'twig') { %>
Please note: Pattern calls need to follow the normal Twig Pattern Syntax, even though they are within a .hbs file.
<% } %>

### Partials

Place your partials in the folder `partial` inside the `template` folder and reference them in your `.hbs` file (e.g. `{{> partial/example.link}}`)  

### Helpers

Clientside handlebars helpers can be stored as normal JavaScript files in the patterns folder or in `src/assets/js`.
After that, they can be used normally in your clientside template

## Handlebars versions

Two handlebars versions are in use at the moment. They should have similar versions ;-)

* One to render views for nitro and to precompile the templates on the server side (`hbs.handlebars` currently 4.0.5)
* A handlebars runtime to render the precompiled template on the client side (`handlebars` currently 4.0.8)
