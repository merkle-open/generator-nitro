# Replacements Patterns

Nitro provides the following [Lodash](https://lodash.com/docs#template) replacement patterns for your blueprints. 

    <%= user.name %>		// Your name, eg. John Doe
    <%= user.email %>		// Your email, eg. john@doe.com
    
    <%= component.name %>	// Component name, eg. Main Navigation
    <%= component.folder %>	// Component folder, eg. MainNavigation
    <%= component.js %> 	// Component name for use in JS files, eg. MainNavigation
    <%= component.css %> 	// Component name for use in CSS files, eg. main-navigation
    <%= component.prefix %>	// CSS class prefix, eg. o
    <%= component.type %>	// Component type as specified in config.json, eg. atom, molecule etc. 
    <%= component.file %>	// Component filename, eg. mainnavigation
    
    <%= modifier.name %>	// Modifier name, eg. Highlight 
    <%= modifier.css %> 	// Modifier name for use in CSS files, eg. highlight
    <%= modifier.file %> 	// Modifier filename part, eg. highlight
    
    <%= decorator.name %>	// Decorator name, eg. Highlight 
    <%= decorator.js %> 	// Decorator name for use in JS files, eg. Highlight
    <%= decorator.file %> 	// Decorator filename part, eg. highlight
