# Nitro Themes

Nitro offers extensive configuration possibilities and features for the development 
of different themes/skins (or whatever you would name them).

## Usage

### Run modes

#### Development mode

In development mode, each theme is started separately. 
It should be possible to run them in parallel (as long as you configure the start scripts with different ports)

```
npm run start:<theme-id>
```

#### Production mode

In production mode (proto), a special mode is used. Only one server is started.
A session is initiated to save the current desired theme.

```
npm run prod
```

...starts the server with the default theme (configured in themes configuration).

To change the theme for the session, use special routes:

-   `/theme/<theme-id>` (sets session to <theme-id> and redirects to the '/index' page)
-   `/theme/<theme-id>?ref=/example-patterns` (sets session and redirects to '/example-patterns')

## Requirements

-   Themes configuration
-   Webpack configuration
-   npm scripts
-   Gulp config
-   Theme routes

### Themes Configuration

The basic themes configuration can be found in your [config](../../config).

The 'themes' node contains an array of theme objects. A theme object contains following properties 

-   `id` String (required)
-   `name` String (required)
-   `isDefault` (required in one of the themes)

...

#### Example Themes Configuration

```
themes: [
    {
        id: 'light',
        name: 'Light Theme',
        isDefault: true,
        isLight: true,
    },
    {
        id: 'dark',
        name: 'Dark Theme',
        isDark: true,
    },
]
```

Of course you can also add additional properties (like 'isLight' or 'isDark' in the example).
They will be available in your views.

### Webpack Configuration

Configure 'options.features.theme' and `options.features.dynamicAlias` in your 
[webpack configuration](./nitro-webpack.md) to enable themes functionality.

And add an entry file per theme in the src folder ('ui.<theme-id>.js|ts')

### npm scripts

Run modes and build tasks are configured in 'package.json'

#### start

For development mode you need a start script for each theme:

```
"start:<theme-id>": "cross-env THEME=<theme-id> PORT=8081 PROXY=8082 npm run dev",
```

Use different ports for each theme to be able to run them in parallel.

#### Build

For each theme a separate build is created and stored in a separate folder.
So you need a build script for each theme:

```
"build:webpack:<theme-id>": "cross-env THEME=<theme-id> webpack --mode production --config config/webpack/webpack.config.prod.js"
```

### Gulp

If necessary configure the [gulp tasks](../../config/default/gulp.js) (copyAssets minifyImages svgSprites) with paths for the different themes.

### Theme routes

The nitro generator created a '_themes' route in [project/routes](../../project/routes/_themes.js).

This route does two things:

1.  Enriches locals with theme properties (`{{theme.id}}`, `{{theme.name}}` & whatever you defined in your themes config) for Handlebars usage.

1.  Handles theme session in production mode (mainly for switching theme `/theme/<theme-id>`)

## Start theming

The best thing to do is to look at the examples that the generator produces when a new project is generated.

Below are the main functionalities:

### Entry File

The starting point is the entry file. For each theme there is an entry file in the format: 'src/ui.\<theme\>.js|ts'
Import the code you need for a specific theme.

### Webpack path resolving

Theming is especially useful for loading different styles per theme.
Always import the soure file with the code for the default theme. 
The Dynamic Alias Resolver plugin will exchange the configured path (e.g. `/theme/light`)
with the path to the correct theme when compiling.

Abstraction for themed colors as an example:

```
// colors.scss
@import './theme/light.scss';

$color-base-font: $foreground;
$color-base-background: $background;
$color-area-background: $area;

$color-brand-font: $white;
```

The pattern.scss uses the themed colors and a themed pattern import with variables for padding and border radius:

```
// pattern.scss
@import '../../../../shared/utils/colors/css/colors.scss';
@import './theme/light.scss';

.m-example {
	margin: 1em 0;
	padding: $example-padding;
	background-color: $color-area-background;
	border-radius: $example-border-radius;
}
```

### Handlebars Helpers

Available helpers from Nitro:

-   The **'asset'** helper respects the theme build structure. Link your assets as normal:

`{{asset name='/css/ui.min.css'}}` will load 'public/assets/\<theme>\/css/ui.css' in development mode and
'public/assets/\<theme\>/css/ui.min.css' in production mode.

-   Use the **'themelist'** helper to display a list of themes based on the config theme array:

`{{themelist current=theme.id}}`
