# Precompiled handlebars templates for Nitro

Precompiled templates allow markup to be precompiled on the server to be used on the client side to render dynamic data.
For this to work you need a handlebars runtime on the client side.

## Generating Templates

### Template source

The templates are generated from all files with the file type `.hbs` located in the directory `template` within a pattern.  
The template name has not to contain slashes or special characters. Use only names with lowercase letters, dashes and dots.  

### Precompiled template

The precompiled template will be placed in the same directory as the source with the same name and the file extension `js`.

### Naming and namespace

`T.tpl` is used as the namespace for the precompiled templates by default and is conifgured in `gulp/compile-templates.js`
The name of the source file defines the key to access the precompiled template.  
Hence the generated precompiled template can be accessed via the JavaScript object `T.tpl.<name>`.

Example:

* example.hbs --> example.js --> `T.tpl.example`
* example.links.hbs --> example.links.js --> `T.tpl.example.links`

### Usage

The following js code shows an example how to use a precompiled template.

    // check whether the precompiled template exists
    if (T.tpl && T.tpl.example) {
    
        // define the data
        var data = {
            'modifier': '',
            'decorator': '',
            ...
        },
        
        // compile the template with data
        var example = T.tpl.example(data),
        
        // transform it into a jquery object
        var $example = $(example);
        
        // use it
        $ctx.append($example);
    }

## Partials and helpers

### Partials

Place your partials in the folder `partial` inside the `template` folder and nitro will do the registration for you.  
Precompiled partials will be stored in the same manner as templates.

### Helpers

Clientside handlebars helpers can be stored as normal JavaScript files in the patterns folder or in `src/assets/js`.

### Using the pattern one to one

If you want to use the code of a serverside pattern unchanged for your clientside template you may use the nitro `pattern` helper for this. 

    {{pattern 'example'}}

## Handlebars versions

Two handlebars versions are in use at the moment. They should have similar versions ;-)

* One to render views for nitro and to precompile the templates on the server side (`hbs.handlebars` currently 4.0.5)
* A handlebars runtime to render the precompiled template on the client side (`handlebars` currently 4.0.8)
