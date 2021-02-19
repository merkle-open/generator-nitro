# Replacements Patterns

Nitro provides the following replacement patterns for your blueprints.

## Pattern Generator

`npm run nitro:pattern` uses directories configured in 'config.nitro.patterns.<type>.template'

**In Content**:

```
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
```

**In Filename**:

```
$pattern$               // Pattern filename, eg. mainnavigation
$modifier$              // Modifier filename part eg. highlight
$decorator$             // Decorator filename part, eg. highlight
```

## Server Generator

`npm run nitro:server` uses 'server/package.json' if present

<%= nitroAppVersion %>     // Version of devDependency '@nitro/app' from project package.json
<%= nodeVersion %>         // 'engines/node' from project package.json
<%= npmVersion %>          // 'engines/npm' from project package.json
<%= projectName %>         // 'name' from project package.json
<%= projectVersion %>      // 'version' from project package.json
