[![CircleCI](https://img.shields.io/circleci/build/github/vkolencik/cmd-to-json?label=CircleCI%20build)](https://circleci.com/gh/vkolencik/cmd-to-json)
![](https://img.shields.io/bundlephobia/min/cmd-to-json/latest)
[![Latest version](https://img.shields.io/npm/v/cmd-to-json)](https://img.shields.io/npm/v/cmd-to-json?label=latest%20version)

# cmd-to-json

This is a simple utility for creating JSONs from the command line.

# Usage

Install:
```
npm i -g cmd-to-json
```

Create JSON by specifying properties and their values, like this:
```
to-json name="John Doe" age=32 married=true
```
gives this output:
```json
{"name":"John Doe","age":32,"married":true}
```

## Explicit formats
You may force format of a property like this:
```
to-json houseNumber:string=134
```
which will yield
```json
{"houseNumber":"134"}
```

Apart from `string`, there are `number` and `boolean` formats that can be used
for input validation (i.e. an error is thrown when the value does not conform
to the format).

Full list of formats:

| Format       | Valid value examples          | Resulting property value            | Note                                            |
|--------------|-------------------------------|-------------------------------------|-------------------------------------------------|
| `number`     | `1`, `"1"`, `1.234`, `1e2`    | `1`, `1`, `1.234`, `100`            |                                                 |
| `boolean`    | `true`, `false`, `TRUE`       | `true`, `false`, `true`             | Not case sensitive                              |
| `string`     | `John`, `"John"`, `1`, `true` | `"John"`, `"John"`, `"1"`, `"true"` | Useful to suppress default formatting           | 
| `singleline` | `more\nlines`                 | `"more lines"`                      | Replaces sequences of newlines by a space       |

## Limitations
Currently there's no way to escape the special characters in property names
(`:`, `=`, `+`, `.`, single `_`). 