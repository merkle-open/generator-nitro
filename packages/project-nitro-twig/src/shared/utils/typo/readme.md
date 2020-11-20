# Typo

> Typography util which returns a set of typography styles for one or all defined viewports

## Usage

Please note: depending on the number of viewports, the output bundle size might get a bit large!

### typography mixin

Writes desired typography definition.

```
@import 'src/shared/utils/typo/css/typo';

span { @include typography('body') }
span { @include typography('h1') }
```

Or use a second parameter !== 'all' to only import the definition for specific viewport:

```
@import 'src/shared/utils/typo/css/typo';

span { @include typography('h2', 'md') }
```

Or use the font-family / font-weight / font-style variables to use the globally defined font properties:

```
@import 'src/shared/utils/typo/css/typo';

span { font-family: $typography-family-sans; }
span { font-weight: $typography-weight-bold; }
span { font-style: $typography-style-italic; }
```

### get-font-definition function

Returns a font definition map from a specific viewport

```
@import 'src/shared/utils/typo/css/typo';

$definition: get-font-definition('body', 'md');
```
