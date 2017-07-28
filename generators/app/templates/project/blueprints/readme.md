# Replacements Patterns

Nitro provides the following [Lodash](https://lodash.com/docs#template) replacement patterns for your blueprints. 

    <%= user.name %>        // Your name, eg. John Doe
    <%= user.email %>       // Your email, eg. john@doe.com
    
    <%= pattern.name %>	    // Pattern name, eg. Main Navigation
    <%= pattern.folder %>   // Pattern folder, eg. MainNavigation
    <%= pattern.js %>       // Pattern name for use in JS files, eg. MainNavigation
    <%= pattern.css %>      // Pattern name for use in CSS files, eg. main-navigation
    <%= pattern.prefix %>   // CSS class prefix, eg. o
    <%= pattern.type %>     // Pattern type as specified in configuration, eg. atom, molecule etc. 
    <%= pattern.file %>     // Pattern filename, eg. mainnavigation
    
    <%= modifier.name %>    // Modifier name, eg. Highlight 
    <%= modifier.css %>     // Modifier name for use in CSS files, eg. highlight
    <%= modifier.file %>    // Modifier filename part, eg. highlight
    
    <%= decorator.name %>   // Decorator name, eg. Highlight 
    <%= decorator.js %>     // Decorator name for use in JS files, eg. Highlight
    <%= decorator.file %>   // Decorator filename part, eg. highlight
