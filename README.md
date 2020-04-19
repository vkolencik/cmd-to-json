[![CircleCI](https://img.shields.io/circleci/build/github/vkolencik/cmd-to-json?label=CircleCI%20build)](https://circleci.com/gh/vkolencik/cmd-to-json)
![](https://img.shields.io/bundlephobia/min/cmd-to-json/latest)
[![Latest version](https://img.shields.io/npm/v/cmd-to-json)](https://www.npmjs.com/package/cmd-to-json)

# cmd-to-json

A simple CLI utility for creating JSONs from the command line.

## Installation 
```
npm i -g cmd-to-json
```

## Usage
Create JSON from command line by specifying properties and their values:
```
to-json name="John Doe" age=32 married=true
```
gives this output (formatted for better readability):
```json
{
  "name": "John Doe",
  "age": 32,
  "married": true
}
```

### Nested objects
Nested structures can be created by using dots in property names:
```
to-json version=1 person.name="John" person.age=32
```
will yield:
```json
{
  "version": 1,
  "person": {
    "name": "John",
    "age": 32
  }
}
```

Arrays are not yet supported.

## Explicit formats

Numbers and booleans are recognized and formatted automatically. You may force a specific format like this:
```
to-json houseNumber:string=134 age:number=35
```
which will yield
```json
{"houseNumber":"134","age":35}
```

Appending `:string` suppresses automatic formatting. `:number` and `:boolean` can be used
for input validation (e.g. `to-json age:number="foo"` will throw an error).

###Full list of formats

| Format       | Valid value examples          | Resulting property value            | Note
|--------------|-------------------------------|-------------------------------------|---
| `number`     | `1`, `"1"`, `1.234`, `1e2`    | `1`, `1`, `1.234`, `100`            | Useful for validation.
| `boolean`    | `true`, `false`, `TRUE`       | `true`, `false`, `true`             | Dtto. Not case sensitive.
| `string`     | `John`, `"John"`, `1`, `true` | `"John"`, `"John"`, `"1"`, `"true"` | Useful to suppress default formatting. 
| `singleline` | `more\nlines`                 | `"more lines"`                      | Replaces sequences of newlines by a space.

## Limitations
Currently there's no way to escape the special characters in property names
(`:`, `=`, `+`, `.`, single `_`). 