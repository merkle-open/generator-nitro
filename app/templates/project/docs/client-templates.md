# Precompiled handlebars templates for Nitro

Precompiled templates allow markup to be precompiled on the server to be used on the client side to render dynamic data.
For this to work you need a handlebars runtime on the client side (already configured in bower.json).

## Template source

The templates are generated from all files located in the directory `template` within a component with the file type `.hbs`.  
The template name has not to contain slashes or special characters. Use only names with lowercase letters, dashes and dots.  
All handlebars helpers will be precompiled unchanged and have to be handled on the client side.

## Template output

The precompiled template will be placed in the same `template` directory as the source.  
The name of this output is the same as the one of the source.  
The file type of the precompiled template is `.js`.

## Precompiled template namespace

The name of the source file defines the key to access the precompiled template.  
Hence the generated precompiled template can be accessed via the JavaScript object `T.tpl.<name>`.

Example:

* example.hbs --> example.js --> `T.tpl.example`
* example.sub.hbs --> example.sub.js --> `T.tpl.example.sub`

## Usage

The following js code shows an example to use the template of a test component with the source file `Test/template/test.hbs`.

    // check whether the precompiled template exists
    if (T.tpl && T.tpl.test) {
    
        // define the data
        var data = {
            'modifier': '',
            'decorator': '',
            ...
        },
        
        // compile the template with data
        test = T.tpl.test(data),
        
        // transform it into a jquery object
        $test = $(test);
        
        // use it
        $ctx.append($test);
    }

## Handlebars versions

Two handlebars versions are in use at the moment. They should bave similar versions ;-)

* One to render views for nitro and to precompile the templates on the server side (`hbs.handlebars` currently 4.0.3)
* A handlebars runtime to render the precompiled template on the client side (`handlebars` currently 4.0.5 through bower)
