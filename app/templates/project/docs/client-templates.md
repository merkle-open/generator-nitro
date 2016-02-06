# Nitro - Precompiled templates

Precompiled templates allow markup to be precompiled on the server to be used on the client side to render dynamic data.
For this to work you need a handlebars runtime on the client side (already configured in bower.json).

## Template source
The templates are generated from all files located in the directory `template` within a component with the file type `.hbs`.

The template name has not to contain slashes or special characters. Use only names with lowercase letters, dashes and dots.

Dashes help to define template variants. Dots lead to new subobjects in the namespace (explanation later in the document).

All handlebars helpers will be precompiled unchanged and have to be handled on the client side.

## Template output
The precompiled template will be placed in the same `template` directory as the source.

The name of this output is the same as the one of the source.

The file type of the precompiled template is `.js`.

## Precompiled template namespace
The name of the source file defines the key to access the precompiled template.

Hence the generated precompiled template can be accessed via the JavaScript object `T.tpl.NAME`.

Example:

* example.hbs --> example.js --> `T.tpl.example`
* example-variant.hbs --> example-variant.js --> `T.tpl.example-variant`
* example-variant.sub.hbs --> example-variant.sub.js --> `T.tpl.example-variant.sub`

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
Unfortunately 3 handlebars are in use at the moment:

* One to render views for nitro (`hbs` 4.0.3 with package.json)
* One to precompile the templates on the server side (`gulp-handlebars` 3.0.0 with package.json)
* A handlebars runtime to render the precompiled template on the client side (`handlebars` 3.0.3 with bower)  
