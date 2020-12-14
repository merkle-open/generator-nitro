# box

This is a box example pattern.

## Usage

It can be used as a pattern with a content string:

- from data.json
- or {{pattern content='content <strong>string</string>'}}

... or use with transclusion to pass any content:

```
{{#pattern name='box'}}
    {{pattern name='button'}}
{{/pattern}}
```

## API

modifier `a-box--dark` for dark background

## Testing

[Example page](http://localhost:8081/example-patterns)

- Visual test
