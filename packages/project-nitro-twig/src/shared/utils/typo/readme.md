# Typo

> Typography util which returns a set of typography styles for one or all defined viewports

## Usage

Please note: depending on the number of viewports, the output bundle size might get a bit large!

### typography mixin

Writes desired typography definition.

```
@use 'src/shared/utils/typo/css/typo';

span { @include typo.typography('body') }
span { @include typo.typography('h1') }
```

Or use a second parameter !== 'all' to only import the definition for specific viewport:

```
@use 'src/shared/utils/typo/css/typo';

span { @include typo.typography('h2', 'md') }
```

Or use the font-family / font-weight / font-style variables to use the globally defined font properties:

```
@use 'src/shared/utils/typo/css/typo';

span { font-family: typo.$typography-family-sans; }
span { font-weight: typo.$typography-weight-bold; }
span { font-style: typo.$typography-style-italic; }
```

### get-font-definition function

Returns a font definition map from a specific viewport

```
@use 'src/shared/utils/typo/css/typo';

$definition: typo.get-font-definition('body', 'md');
```
