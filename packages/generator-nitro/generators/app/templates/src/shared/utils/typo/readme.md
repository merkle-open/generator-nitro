# Typo

> Typography util

## Usage

### typography mixin

Writes desired typography definition.

```
@import 'src/shared/utils/typo/css/typo';

span { @include typography('sans-s') }
span { @include typography('serif-m') }
```

Or use a second parameter !== 'all' to only import the definition for specific viewport:

```
@import 'src/shared/utils/typo/css/typo';

span { @include typography('sans-s', 'md') }
```

Or use the font-family / font-weight / font-style properties to just get single properties:

```
@import 'src/shared/utils/typo/css/typo';

span { @include typography('font-family', 'text') }
span { @include typography('font-weight', 'bold') }
span { @include typography('font-style', 'italic') }
```

### get-font-definition function

Returns a font definiton map from a specific viewport

```
@import 'src/shared/utils/typo/css/typo';

$definition: get-font-definition('body', 'md');
```
