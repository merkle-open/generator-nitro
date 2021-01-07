# Patterns

A pattern is an encapsulated block of markup with corresponding styles, scripts and data.
The pattern should be documented in a `readme.md` and data can be described in `schema.json`
with [JSON schema](http://json-schema.org) (currently draft-04, but soon open for newer versions).
Nitro uses [ajv](https://github.com/ajv-validator/ajv/tree/v6) for validation.

For a better overview it is useful to define different types of patterns in [config](../../project/docs/nitro-config.md).
