# ArgParser
![version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/SlimIO/ArgParser/master/package.json?token=AOgWw3vrgQuu-U4fz1c7yYZyc7XJPNtrks5catjdwA%3D%3D&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/ArgParser/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
![0DEP](https://img.shields.io/badge/Dependencies-0-yellow.svg)
[![Build Status](https://travis-ci.com/SlimIO/ArgParser.svg?branch=master)](https://travis-ci.com/SlimIO/ArgParser)

**Secure** and **reliable** Command Line Argument parser for **Node.js** ! ArgParser was designed to be embedded in a SlimIO agent, most popular library was not matching our expectation (and security needs).

It does not aim to replace (or to be) popular CLI lib like `yargs` or `commander`. Please, do not use this package if you do not know what you are doing.

> Warning: The API doesn't aim to be "runtime" safe.

## Why

- Secure with 0 external dependencies.
- Only ship feature required for SlimIO.
- Light, simple and fast!

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @slimio/arg-parser
# or
$ yarn add @slimio/arg-parser
```

## Usage example

Create the following javascript script:
```js
const { parseArg, argDefinition } = require("@slimio/arg-parser");

const result = parseArg([
    argDefinition("-c --colors [array]", "Array of colors"),
    argDefinition("--verbose", "Enable verbose mode!")
]);

console.log(result);
```

And then run the following command line:
```bash
$ node yourscript --colors red blue --verbose
$ Map { 'colors' => [ 'red', 'blue' ], 'verbose' => true }
```

## API
<details><summary>argDefinition(cmd: string, description?: string): Command</summary>
<br />

Generate a new Command definition. cmd argument is a string pattern that will be matched against the following regex:
```js
/^(-{1}(?<shortcut>[a-z]){1})?\s?(-{2}(?<name>[a-z]+)){1}\s?(\[(?<type>number|string|array)(=(?<defaultVal>.*))?\])?$/;
```

Take a look at the root directory `example` for more examples of how to use addCommand !
```js
const { parseArg, argDefinition } = require("@slimio/arg-parser");

const result = parseArg([
    argDefinition("--verbose", "Enable verbose mode!"),
    argDefinition("-a --autoreload [number=500]", "Configuration Autoreload delay in number")
]);
```
A command is described as follow on TypeScript:
```ts
interface Command {
    name: string;
    type: string;
    description: string;
    shortcut?: string;
    defaultVal?: number | string | boolean | any[];
}
```
Feel free to redefine the wrapper as you want !
</details>


<details><summary>parseArg< T >(argDefinitions: Command[], argv?: string[]): Map< keyof T, T[keyof T] ></summary>
<br />

Parse Argv (or any input `string[]`). Return a ECMAScript6 Map Object.

```js
const { parseArg, argDefinition } = require("@slimio/arg-parser");

const argv = parseArg([
    argDefinition("--level [number=1]")
], ["--level", "10"]);
console.log(argv.get("level"));
```
</details>

## License
MIT
